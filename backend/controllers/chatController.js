const chatService = require('../services/chatService');
const respondError = require('./respondError');

const getMessages = async (req, res) => {
  try {
    const messages = await chatService.getMessages(req.params.applicationId, req.user.userId);
    res.json(messages);
  } catch (error) {
    respondError(res, error, 'Server error');
  }
};

module.exports = { getMessages };