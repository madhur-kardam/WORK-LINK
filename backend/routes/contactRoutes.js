const express = require('express');
const authMiddleware = require('../middleware/auth');
const { submitContact, getContacts } = require('../controllers/contactController');

const router = express.Router();

router.post('/', submitContact);
router.get('/', authMiddleware, getContacts);

module.exports = router;
