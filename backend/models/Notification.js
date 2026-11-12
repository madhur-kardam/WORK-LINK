const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  posterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // who receives the notification (job poster)
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobType: { type: String, required: true },         // e.g. "Carpenter" - stored directly so we don't need to re-query
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  applicantPhone: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
