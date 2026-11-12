import { request } from './api.js';

export const getJobs = () => request('/jobs');

export const createJob = (data) =>
  request('/jobs', { method: 'POST', body: data, auth: true });

export const getMyJobs = () => request('/jobs/user/posted', { auth: true });

export const deleteJob = (jobId) =>
  request(`/jobs/${jobId}`, { method: 'DELETE', auth: true });
