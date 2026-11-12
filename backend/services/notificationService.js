const Notification = require('../models/Notification');

// Create a notification for the job poster
const createForApplication = async ({ job, application, user }) => {
  const notification = new Notification({
    posterId: job.userId,
    applicationId: application._id,
    jobId: job._id,
    jobType: job.type,
    applicantName: user.name,
    applicantEmail: user.email,
    applicantPhone: user.phone
  });
  await notification.save();
  return notification;
};

const getForPoster = async (posterId) => {
  const notifications = await Notification.find({ posterId })
    .sort({ createdAt: -1 }); // newest first

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return { notifications, unreadCount };
};

const markAllRead = (posterId) =>
  Notification.updateMany(
    { posterId, isRead: false },
    { $set: { isRead: true } }
  );


  const belongsToPoster = async (applicationId, posterId) =>
  !!(await Notification.exists({ applicationId, posterId }));

module.exports = { createForApplication, getForPoster, markAllRead, belongsToPoster };
