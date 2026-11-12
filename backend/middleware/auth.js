const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    // expired or invalid -> 401 so the frontend knows to refresh the token
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
