const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const HttpError = require('./httpError');
const { getJwtSecret, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_DAYS } = require('../config/jwt');

// If the same refresh token arrives twice within this time (two tabs, double request)
// we do not treat it as theft.
const GRACE_MS = 10 * 1000;

// ---------- helpers ----------
const signAccessToken = (user) =>
  jwt.sign(
    { userId: user._id, email: user.email, userType: user.userType },
    getJwtSecret(),
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

const toUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  userType: user.userType
});

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// Creates a random refresh token, stores its hash, returns the raw token (for the cookie)
const issueRefreshToken = async (userId) => {
  const token = crypto.randomBytes(48).toString('hex');
  await RefreshToken.create({
    userId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000)
  });
  return token;
};

const startSession = async (user) => ({
  token: signAccessToken(user),
  refreshToken: await issueRefreshToken(user._id),
  user: toUserResponse(user)
});

// ---------- register / login ----------
const register = async ({ name, email, phone, password, userType }) => {
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError(400, 'User already exists with this email');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = new User({
    name,
    email,
    phone,
    password: hashedPassword,
    userType
  });

  await user.save();

  return startSession(user);
};

const login = async ({ email, password }) => {
  // Check user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(400, 'Invalid email or password');
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new HttpError(400, 'Invalid email or password');
  }

  return startSession(user);
};

// ---------- keep the user logged in ----------
// Swaps a valid refresh token for a new access token + a NEW refresh token (rotation).
// A used refresh token can never be used again.
const refreshSession = async (oldToken) => {
  if (!oldToken) {
    throw new HttpError(401, 'No refresh token');
  }

  const tokenHash = hashToken(oldToken);

  // Atomically "use up" the token: only one request can win this
  const now = new Date();
  const claimed = await RefreshToken.findOneAndUpdate(
    { tokenHash, revokedAt: null, expiresAt: { $gt: now } },
    { revokedAt: now, usedAt: now }
  );

  if (claimed) {
    const user = await User.findById(claimed.userId);
    if (!user) throw new HttpError(401, 'Session expired');

    return {
      token: signAccessToken(user),
      refreshToken: await issueRefreshToken(user._id),
      user: toUserResponse(user)
    };
  }

  // Not claimed: unknown, expired, logged out, or already used
  const record = await RefreshToken.findOne({ tokenHash });

  // Unknown / expired / logged out (never rotated) -> just reject
  if (!record || !record.usedAt) {
    throw new HttpError(401, 'Session expired');
  }

  // Rotated a moment ago (two tabs racing): give a new access token, keep the cookie the other request set
  if (Date.now() - record.usedAt.getTime() <= GRACE_MS) {
    const user = await User.findById(record.userId);
    if (!user) throw new HttpError(401, 'Session expired');
    return { token: signAccessToken(user), refreshToken: null, user: toUserResponse(user) };
  }

  // Already rotated long ago and presented again -> the token may have been stolen: sign out everywhere
  await RefreshToken.updateMany(
    { userId: record.userId, revokedAt: null },
    { revokedAt: new Date() }
  );
  throw new HttpError(401, 'Session expired');
};

// Revokes the refresh token of this browser
const logout = async (token) => {
  if (!token) return;
  await RefreshToken.updateOne(
    { tokenHash: hashToken(token), revokedAt: null },
    { revokedAt: new Date() }
  );
};

const getCurrentUser = (userId) => User.findById(userId).select('-password');

module.exports = { register, login, refreshSession, logout, getCurrentUser };
