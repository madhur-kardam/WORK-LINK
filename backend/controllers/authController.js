const authService = require('../services/authService');
const HttpError = require('../services/httpError');
const respondError = require('./respondError');
const { REFRESH_TOKEN_DAYS } = require('../config/jwt');

const REFRESH_COOKIE = 'refreshToken';

// httpOnly = JavaScript (and therefore XSS) can't read it; path = only sent to /api/auth/*
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production', // HTTPS only when deployed
  path: '/api/auth',
  maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000
};
const { maxAge, ...clearOptions } = cookieOptions;

const setRefreshCookie = (res, token) => res.cookie(REFRESH_COOKIE, token, cookieOptions);

// Register
const register = async (req, res) => {
  try {
    const { token, refreshToken, user } = await authService.register(req.body);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    respondError(res, error, 'Server error during registration', 'Registration error:');
  }
};

// Login
const login = async (req, res) => {
  try {
    const { token, refreshToken, user } = await authService.login(req.body);
    setRefreshCookie(res, refreshToken);

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    respondError(res, error, 'Server error during login', 'Login error:');
  }
};

// New access token from the refresh cookie (called on page load and when the token expires)
const refresh = async (req, res) => {
  try {
    const { token, refreshToken, user } = await authService.refreshSession(req.cookies?.[REFRESH_COOKIE]);
    if (refreshToken) setRefreshCookie(res, refreshToken);

    res.json({ token, user });
  } catch (error) {
    if (error instanceof HttpError) res.clearCookie(REFRESH_COOKIE, clearOptions);
    respondError(res, error, 'Server error', 'Refresh error:');
  }
};

// Logout: revoke the refresh token and remove the cookie
const logout = async (req, res) => {
  res.clearCookie(REFRESH_COOKIE, clearOptions);
  try {
    await authService.logout(req.cookies?.[REFRESH_COOKIE]);
    res.json({ message: 'Logged out' });
  } catch (error) {
    respondError(res, error, 'Server error', 'Logout error:');
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.userId);
    res.json(user);
  } catch (error) {
    respondError(res, error, 'Server error');
  }
};

module.exports = { register, login, refresh, logout, getMe };
