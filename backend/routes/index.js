const express = require('express');

const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/jobs', require('./jobRoutes'));
router.use('/applications', require('./applicationRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/chats', require('./chatRoutes'));
router.use('/contact', require('./contactRoutes'));
router.use('/stats', require('./statsRoutes'));

module.exports = router;
