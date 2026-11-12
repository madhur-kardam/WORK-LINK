const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const HttpError = require('./httpError');
const notificationService = require('./notificationService');

const applyForJob = async (userId, jobId) => {
  const user = await User.findById(userId);

  // Only job seekers can apply
  if (!user || user.userType !== 'seeker') {
    throw new HttpError(403, 'Only job seekers can apply for jobs');
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new HttpError(404, 'Job not found');
  }

  // Nobody can apply to a job they posted
  if (job.userId.toString() === String(userId)) {
    throw new HttpError(403, 'You cannot apply to your own job');
  }

  // Check if already applied
  const existingApp = await Application.findOne({ jobId, userId });
  if (existingApp) {
    throw new HttpError(400, 'You have already applied for this job');
  }

  // Generate application ID
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const applicationId = `WL-2025-${String(timestamp).slice(-5)}${String(random).toString().padStart(4, '0')}`;

  const application = new Application({
    jobId,
    userId,
    applicantName: user.name,
    applicantEmail: user.email,
    applicantPhone: user.phone,
    applicationId
  });

  await application.save();

  await notificationService.createForApplication({ job, application, user });

  return { application, job };
};

const getUserApplications = (userId) =>
  Application.find({ userId })
    .populate('jobId')
    .sort({ createdAt: -1 });

const getApplicationsForPoster = async (userId) => {
  const jobs = await Job.find({ userId });
  const jobIds = jobs.map(job => job._id);

  return Application.find({ jobId: { $in: jobIds } })
    .populate('jobId')
    .sort({ createdAt: -1 });
};

const updateStatus = async (id, userId, status) => {
  if (!['accepted', 'rejected'].includes(status)) {
    throw new HttpError(400, 'Invalid status');
  }

  const application = await Application.findById(id).populate('jobId');

  if (!application) {
    throw new HttpError(404, 'Application not found');
  }

  // Check if user owns the job
  if (application.jobId.userId.toString() !== userId) {
    throw new HttpError(403, 'Unauthorized');
  }

  application.status = status;
  await application.save();
  return application;
};

const getApplicantProfile = async (applicationId, posterId) => {
  const application = await Application.findById(applicationId).populate('jobId');
  if (!application) throw new HttpError(404, 'Application not found');

  const allowed = await notificationService.belongsToPoster(applicationId, posterId);
  if (!allowed) throw new HttpError(403, 'Unauthorized');

  const applicant = await User.findById(application.userId).select('-password');
  if (!applicant) throw new HttpError(404, 'Applicant not found');

  return {
    applicant,
    application: {
      applicationId: application.applicationId,
      status: application.status,
      createdAt: application.createdAt
    },
    job: application.jobId
  };
};

module.exports = {
  getApplicantProfile,
  applyForJob,
  getUserApplications,
  getApplicationsForPoster,
  updateStatus
};
