const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const HttpError = require('./httpError');

const MAX_LENGTH = 1000;

// Plain-string payload (safe to send over Socket.io / JSON)
const toPayload = (m) => ({
  _id: String(m._id),
  applicationId: String(m.applicationId),
  senderId: String(m.senderId),
  text: m.text,
  createdAt: m.createdAt
});

const checkAccess = async (applicationId, userId) => {
  const application = await Application.findById(applicationId);
  if (!application) {
    throw new HttpError(404, 'Application not found');
  }

  const notification = await Notification.findOne({ applicationId }).select('posterId');

  const isSeeker = application.userId.toString() === String(userId);
  const isPoster = !!notification && notification.posterId.toString() === String(userId);

  if (!isSeeker && !isPoster) {
    throw new HttpError(403, 'Unauthorized');
  }

  if (application.status !== 'accepted') {
    throw new HttpError(403, 'Chat is available only after the application is accepted');
  }

  return application;
};

const getMessages = async (applicationId, userId) => {
  await checkAccess(applicationId, userId);

  // latest 200 messages, oldest first
  const messages = await Message.find({ applicationId })
    .sort({ createdAt: -1 })
    .limit(200);

  return messages.reverse().map(toPayload);
};

const saveMessage = async (applicationId, userId, text) => {
  await checkAccess(applicationId, userId);

  const clean = typeof text === 'string' ? text.trim() : '';
  if (!clean) {
    throw new HttpError(400, 'Message cannot be empty');
  }
  if (clean.length > MAX_LENGTH) {
    throw new HttpError(400, `Message too long (max ${MAX_LENGTH} characters)`);
  }

  const message = await Message.create({ applicationId, senderId: userId, text: clean });
  return toPayload(message);
};

module.exports = { checkAccess, getMessages, saveMessage };