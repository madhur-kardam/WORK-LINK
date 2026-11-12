const HttpError = require('../services/httpError');

// Known errors -> their own status/message. Anything else -> 500 with fallback message.
const respondError = (res, error, fallbackMessage, logLabel) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message });
  }
  if (logLabel) console.error(logLabel, error);
  res.status(500).json({ error: fallbackMessage });
};

module.exports = respondError;
