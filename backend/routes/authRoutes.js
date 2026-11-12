const express = require('express');
const authMiddleware = require('../middleware/auth');
const { register, login, refresh, logout, getMe } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);

module.exports = router;
