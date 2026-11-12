import { request } from './api.js';

export const applyForJob = (jobId) =>
  request('/applications', { method: 'POST', body: { jobId }, auth: true });
export const getApplicantProfile = (applicationId) =>
  request(`/applications/${applicationId}/profile`, { auth: true });
export const getMyApplications = () => request('/applications/user', { auth: true });
export const updateApplicationStatus = (applicationId, status) =>
  request(`/applications/${applicationId}/status`, { method: 'PUT', body: { status }, auth: true });