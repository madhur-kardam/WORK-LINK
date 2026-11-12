import { request } from './api.js';

export const getChatMessages = (applicationId) =>
  request(`/chats/${applicationId}/messages`, { auth: true });