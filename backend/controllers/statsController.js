const statsService = require('../services/statsService');
const respondError = require('./respondError');

const getStats = async (req, res) => {
  try {
    const stats = await statsService.getStats();
    res.json(stats);
  } catch (error) {
    respondError(res, error, 'Server error');
  }
};

module.exports = { getStats };
