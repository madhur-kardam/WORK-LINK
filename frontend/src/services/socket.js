import { io } from 'socket.io-client';
import { getAccessToken } from './api.js';

export const createSocket = () =>
  io(import.meta.env.VITE_SOCKET_URL, {
    auth: (cb) => cb({ token: getAccessToken() }),
    withCredentials: true,
    transports: ['websocket', 'polling']
  });