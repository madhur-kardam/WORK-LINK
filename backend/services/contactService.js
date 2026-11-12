const Contact = require('../models/Contact');

const createContact = async (body) => {
  const contact = new Contact(body);
  await contact.save();
  return contact;
};

const getAllContacts = () => Contact.find().sort({ createdAt: -1 });

module.exports = { createContact, getAllContacts };
