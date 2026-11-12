const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  type: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  urgency: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  wage: { type: Number, required: true },
  postedBy: { type: String, required: true },
  contact: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
