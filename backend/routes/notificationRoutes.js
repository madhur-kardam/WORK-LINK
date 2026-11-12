const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getNotifications, markAllRead } = require('../controllers/notificationController');

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.put('/mark-read', authMiddleware, markAllRead);

module.exports = router;
