import { request } from './api.js';

export const getNotifications = () => request('/notifications', { auth: true });

export const markAllNotificationsRead = () =>
  request('/notifications/mark-read', { method: 'PUT', auth: true });
