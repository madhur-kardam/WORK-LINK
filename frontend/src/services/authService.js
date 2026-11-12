import { request } from './api.js';

export const loginUser = (data) =>
  request('/auth/login', { method: 'POST', body: data });

export const registerUser = (data) =>
  request('/auth/register', { method: 'POST', body: data });

export const getMe = () => request('/auth/me', { auth: true });
