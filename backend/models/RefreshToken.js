const mongoose = require('mongoose');

// One document per refresh token. Only a HASH of the token is stored,
// so a database leak does not leak usable tokens.
const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date, default: null }, // set when the token is used (rotated), on logout, or when sessions are revoked
  usedAt: { type: Date, default: null },    // set ONLY when the token was swapped for a new one (rotation)
  createdAt: { type: Date, default: Date.now }
});

// MongoDB deletes the document automatically after expiresAt
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
