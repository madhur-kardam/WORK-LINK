const contactService = require('../services/contactService');
const respondError = require('./respondError');

// Submit contact form
const submitContact = async (req, res) => {
  try {
    await contactService.createContact(req.body);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    respondError(res, error, 'Server error sending message', 'Contact error:');
  }
};

// Get all contacts (admin only - you can add admin role later)
const getContacts = async (req, res) => {
  try {
    const contacts = await contactService.getAllContacts();
    res.json(contacts);
  } catch (error) {
    respondError(res, error, 'Server error');
  }
};

module.exports = { submitContact, getContacts };
