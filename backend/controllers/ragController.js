const Document = require('../models/Document');
const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Contact = require('../models/Contact');
const User = require('../models/User');
const { extractText, chunkText } = require('../utils/documentProcessor');
const { storeEmbeddings, searchSimilarContext } = require('../utils/vectorDb');
const Groq = require('groq-sdk');

// @desc    Upload document, extract text, embed, and store in Pinecone
// @route   POST /api/rag/upload
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, size, path } = req.file;

    // Create DB record
    const document = await Document.create({
      filename: req.file.filename,
      originalName: originalname,
      mimetype: mimetype,
      size: size,
      path: path,
      uploadedBy: req.user._id,
      status: 'Processing'
    });

    // Extract text
    const text = await extractText(path, mimetype);
    
    // Chunk text
    const chunks = chunkText(text, 500, 100);
    
    // Store in vector DB
    await storeEmbeddings(chunks, {
      sourceType: 'Document',
      sourceId: document._id.toString(),
      title: originalname,
      uploadedBy: req.user._id.toString()
    });

    // Update DB record
    document.chunkCount = chunks.length;
    document.status = 'Completed';
    await document.save();

    res.status(201).json({ 
      message: 'Document uploaded and processed successfully',
      document 
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Failed to process document: ' + error.message });
  }
};

// @desc    Sync CRM Data (Leads, Deals, Contacts) to Vector DB
// @route   POST /api/rag/sync
// @access  Private (Admin only)
const syncCRMData = async (req, res) => {
  try {
    // Basic authorization check
    if (req.user.role !== 'CEO' && req.user.role !== 'SalesLead') {
      return res.status(403).json({ message: 'Not authorized to sync CRM data' });
    }

    let totalEmbedded = 0;

    // Sync Leads
    const leads = await Lead.find({});
    for (const lead of leads) {
      const text = `Lead Name: ${lead.name}. Email: ${lead.email}. Status: ${lead.status}. Source: ${lead.source || 'Unknown'}. Notes: ${(lead.notes || []).map(n => n.text).join(' ')}. AI Insights: ${lead.aiInsights?.summary || 'None'}`;
      await storeEmbeddings([text], {
        sourceType: 'Lead',
        sourceId: lead._id.toString(),
        title: lead.name
      });
      totalEmbedded++;
    }

    // Sync Deals
    const deals = await Deal.find({});
    for (const deal of deals) {
      const text = `Deal Title: ${deal.title}. Value: $${deal.value}. Company: ${deal.company}. Status: ${deal.status}. Notes: ${deal.notes || 'None'}`;
      await storeEmbeddings([text], {
        sourceType: 'Deal',
        sourceId: deal._id.toString(),
        title: deal.title
      });
      totalEmbedded++;
    }

    // Sync Contacts
    const contacts = await Contact.find({});
    for (const contact of contacts) {
      const text = `Contact Name: ${contact.name}. Email: ${contact.email}. Company: ${contact.company}. Role: ${contact.role}. Status: ${contact.status}. Notes: ${(contact.notes || []).map(n => n.text).join(' ')}`;
      await storeEmbeddings([text], {
        sourceType: 'Contact',
        sourceId: contact._id.toString(),
        title: contact.name
      });
      totalEmbedded++;
    }

    // Sync Users
    const users = await User.find({});
    for (const user of users) {
      const text = `User: ${user.name}. Role: ${user.role}. Email: ${user.email}. Department: ${user.department || 'N/A'}. Company: ${user.companyName || 'N/A'}.`;
      await storeEmbeddings([text], {
        sourceType: 'User',
        sourceId: user._id.toString(),
        title: user.name
      });
      totalEmbedded++;
    }

    res.json({ message: `Successfully synced ${totalEmbedded} CRM records to AI database.` });

  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Failed to sync CRM data: ' + error.message });
  }
};

// @desc    Chat with AI using RAG context via Groq
// @route   POST /api/rag/chat
// @access  Private
const chatWithContext = async (req, res) => {
  const { message, history } = req.body;

  try {
    // 1. Search Vector DB for context
    const contexts = await searchSimilarContext(message, 3);
    
    // 2. Format Context
    let contextText = '';
    let citations = [];

    // Transformers uses cosine similarity but scores vary, usually 0.3+ is decent
    if (contexts.length > 0 && contexts[0].score > 0.3) {
      contextText = contexts.map(c => `[Source: ${c.source} - ${c.title}]\n${c.text}`).join('\n\n');
      citations = contexts.map(c => ({ source: c.source, title: c.title, score: c.score }));
    }

    // Fetch quick DB stats to handle aggregate queries, restricted by role
    const userRole = req.user.role ? req.user.role.toLowerCase() : 'salesperson';
    let leadQuery = {};
    let otherQuery = {};

    if (userRole !== 'ceo' && userRole !== 'admin' && userRole !== 'saleslead') {
      leadQuery = { assignedTo: req.user._id };
      otherQuery = { owner: req.user._id };
    }

    const leadCount = await Lead.countDocuments(leadQuery);
    const dealCount = await Deal.countDocuments(otherQuery);
    const contactCount = await Contact.countDocuments(otherQuery);
    
    // Add User stats
    const totalUsers = await User.countDocuments({});
    const totalSalesPersons = await User.countDocuments({ role: { $in: ['SalesPerson', 'salesPerson'] } });
    const totalSalesLeads = await User.countDocuments({ role: { $in: ['SalesLead', 'salesLead'] } });

    // 3. Prepare Groq Prompt
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    let systemPrompt = `You are a professional AI CRM Assistant for Nexus CRM. 
Your goal is to answer the user's questions accurately.
If relevant CRM data or documents are provided below, you MUST use them to formulate your answer.
If the provided context does not contain the answer, but the database statistics below do, use the statistics.
If neither contains the answer, say "No relevant CRM data found."
Do NOT hallucinate information about the user's business.

--- CURRENT DATABASE STATISTICS ---
Total Leads: ${leadCount}
Total Deals: ${dealCount}
Total Contacts: ${contactCount}
Total Team Members: ${totalUsers}
Total Sales Persons: ${totalSalesPersons}
Total Sales Leads: ${totalSalesLeads}
-----------------------------------

--- RELEVANT CRM DATA / DOCUMENTS ---
${contextText}
-------------------------------------
`;

    const formattedHistory = (history || []).map(m => ({
      role: m.role === 'model' ? 'assistant' : m.role,
      content: m.content
    }));

    // 4. Generate Completion
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedHistory,
        { role: "user", content: message }
      ],
      temperature: 0.2,
      max_tokens: 1024,
    });

    const responseText = chatCompletion.choices[0].message.content;

    res.json({ 
      message: responseText,
      citations: citations.length > 0 ? citations : null
    });

  } catch (error) {
    console.error("Groq RAG Error:", error);
    res.status(500).json({ 
      message: "AI service temporarily unavailable: " + error.message,
      error: error.message,
      stack: error.stack 
    });
  }
};

module.exports = {
  uploadDocument,
  syncCRMData,
  chatWithContext
};

