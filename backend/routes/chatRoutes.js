const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getMessages } = require('../controllers/chatController');

const router = express.Router();

router.get('/:applicationId/messages', authMiddleware, getMessages);

module.exports = router;