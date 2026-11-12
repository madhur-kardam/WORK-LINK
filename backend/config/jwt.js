// Read at call-time so dotenv has already loaded
const getJwtSecret = () => process.env.JWT_SECRET || 'your-secret-key-change-this';

module.exports = {
  getJwtSecret,
  ACCESS_TOKEN_EXPIRES_IN: '15m', // short-lived; the frontend keeps it in memory only
  REFRESH_TOKEN_DAYS: 7           // long-lived; lives in an httpOnly cookie
};
