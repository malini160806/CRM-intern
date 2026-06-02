const Contact = require('../models/Contact');
const { syncRecordEmbedding } = require('../utils/vectorDb');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res) => {
  try {
    let query = { owner: req.user._id };
    
    // CEO and SalesLead (Manager) can see all contacts in the database
    if (req.user.role === 'CEO' || req.user.role === 'SalesLead') {
      query = {};
    }

    const contacts = await Contact.find(query).populate('account', 'name');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a contact
// @route   POST /api/contacts
// @access  Private
const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, account, title, department } = req.body;
    
    const contactData = {
      name,
      email,
      phone,
      title,
      department,
      owner: req.user._id
    };

    if (account && account !== '') {
      contactData.account = account;
    }

    const contact = await Contact.create(contactData);

    // Auto-sync to AI Vector DB
    syncRecordEmbedding(contact, 'Contact').catch(err => console.error("Auto-sync error:", err));

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      contact.name = req.body.name || contact.name;
      contact.email = req.body.email || contact.email;
      contact.phone = req.body.phone || contact.phone;
      contact.account = req.body.account || contact.account;
      contact.title = req.body.title || contact.title;
      contact.department = req.body.department || contact.department;
      contact.status = req.body.status || contact.status;

      const updatedContact = await contact.save();

      // Auto-sync to AI Vector DB
      syncRecordEmbedding(updatedContact, 'Contact').catch(err => console.error("Auto-sync error:", err));

      res.json(updatedContact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (contact) {
      await contact.deleteOne();
      res.json({ message: 'Contact removed' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact
};
