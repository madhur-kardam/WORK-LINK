const notificationService = require('../services/notificationService');
const respondError = require('./respondError');

// Get all notifications for the logged-in poster
const getNotifications = async (req, res) => {
  try {
    const { notifications, unreadCount } = await notificationService.getForPoster(req.user.userId);
    res.json({ notifications, unreadCount });
  } catch (error) {
    respondError(res, error, 'Server error fetching notifications', 'Get notifications error:');
  }
};

// Mark all unread notifications as read
const markAllRead = async (req, res) => {
  try {
    await notificationService.markAllRead(req.user.userId);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    respondError(res, error, 'Server error marking notifications as read', 'Mark read error:');
  }
};

module.exports = { getNotifications, markAllRead };
