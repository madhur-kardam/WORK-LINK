import { io } from 'socket.io-client';
import { getAccessToken } from './api.js';

// New authenticated connection (same origin; Vite proxies /socket.io to the backend).
// `auth` is a function, so every (re)connect sends the latest in-memory access token.
export const createSocket = () =>
  io({ auth: (cb) => cb({ token: getAccessToken() }) });
