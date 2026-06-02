const { Pinecone } = require('@pinecone-database/pinecone');

// We use dynamic import for transformers since it's a large ESM module
let pipelineInstance = null;

const getPipeline = async () => {
  if (!pipelineInstance) {
    const { pipeline } = await import('@xenova/transformers');
    // Use a fast, small embedding model that outputs 384 dimensions
    pipelineInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return pipelineInstance;
};

const initVectorDB = () => {
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const indexName = process.env.PINECONE_INDEX || 'crm-rag-index';
  const index = pinecone.index(indexName);

  return { index };
};

/**
 * Generate embedding for a given text using local Transformers
 */
const generateEmbedding = async (text) => {
  try {
    const extractor = await getPipeline();
    // Generate embeddings
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    // Convert Tensor to standard Array
    return Array.from(output.data);
  } catch (error) {
    console.error("Local Embedding Generation Error:", error);
    throw error;
  }
};

/**
 * Store chunks in Pinecone
 */
const storeEmbeddings = async (chunks, metadataBase = {}) => {
  try {
    const { index } = initVectorDB();
    
    // Process in batches of 10 to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batchChunks = chunks.slice(i, i + batchSize);
      
      const vectors = await Promise.all(
        batchChunks.map(async (text, j) => {
          const embedding = await generateEmbedding(text);
          return {
            id: `${metadataBase.sourceId || 'doc'}-${i + j}`,
            values: embedding,

            metadata: {
              ...metadataBase,
              text: text, // Store the text so we can retrieve it
            }
          };
        })
      );

      await index.upsert({ records: vectors });
    }
    return true;
  } catch (error) {

    console.error('Error storing embeddings in Pinecone:', error);
    throw error;
  }
};

/**
 * Search Pinecone for similar context
 */
const searchSimilarContext = async (queryText, topK = 3) => {
  try {
    const { index } = initVectorDB();
    const queryEmbedding = await generateEmbedding(queryText);

    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: topK,
      includeMetadata: true,
    });

    return queryResponse.matches.map(match => ({
      score: match.score,
      text: match.metadata.text,
      source: match.metadata.sourceType,
      title: match.metadata.title || match.metadata.filename
    }));
  } catch (error) {
    console.error('Error searching Pinecone:', error);
    return [];
  }
};

/**
 * Delete a specific embedding by sourceId
 */
const deleteEmbedding = async (sourceId) => {
  try {
    const { index } = initVectorDB();
    // Try deleting the first 10 possible chunks for this sourceId
    const idsToDelete = Array.from({ length: 10 }, (_, i) => `${sourceId}-${i}`);
    await index.deleteMany(idsToDelete);
  } catch (error) {
    console.error('Error deleting embedding from Pinecone:', error);
  }
};

/**
 * Sync a single record to Pinecone
 */
const syncRecordEmbedding = async (record, type) => {
  try {
    let text = '';
    let title = '';
    
    if (type === 'Lead') {
      title = record.name;
      text = `Lead Name: ${record.name}. Email: ${record.email}. Status: ${record.status}. Source: ${record.source || 'Unknown'}. Notes: ${(record.notes || []).map(n => n.text).join(' ')}. AI Insights: ${record.aiInsights?.summary || 'None'}`;
    } else if (type === 'Deal') {
      title = record.title;
      text = `Deal Title: ${record.title}. Value: $${record.value}. Company: ${record.company}. Status: ${record.status}. Notes: ${record.notes || 'None'}`;
    } else if (type === 'Contact') {
      title = record.name;
      text = `Contact Name: ${record.name}. Email: ${record.email}. Company: ${record.company}. Role: ${record.role}. Status: ${record.status}. Notes: ${(record.notes || []).map(n => n.text).join(' ')}`;
    } else if (type === 'User') {
      title = record.name;
      text = `User: ${record.name}. Role: ${record.role}. Email: ${record.email}. Department: ${record.department || 'N/A'}. Company: ${record.companyName || 'N/A'}.`;
    }
    
    if (text) {
      await storeEmbeddings([text], {
        sourceType: type,
        sourceId: record._id.toString(),
        title: title
      });
    }
  } catch (error) {
    console.error(`Error syncing ${type} embedding:`, error);
  }
};

module.exports = {
  generateEmbedding,
  storeEmbeddings,
  searchSimilarContext,
  deleteEmbedding,
  syncRecordEmbedding
};
