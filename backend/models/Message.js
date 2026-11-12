const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true }, // one chat per application
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now }
});

messageSchema.index({ applicationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);