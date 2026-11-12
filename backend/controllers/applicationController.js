const applicationService = require('../services/applicationService');
const respondError = require('./respondError');

// Apply for job
const applyForJob = async (req, res) => {
  try {
    const { application, job } = await applicationService.applyForJob(req.user.userId, req.body.jobId);

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
      job
    });
  } catch (error) {
    respondError(res, error, 'Server error submitting application', 'Application error:');
  }
};

// Get user's applications
const getUserApplications = async (req, res) => {
  try {
    const applications = await applicationService.getUserApplications(req.user.userId);
    res.json(applications);
  } catch (error) {
    respondError(res, error, 'Server error');
  }
};

// Get applications for poster's jobs
const getPostedApplications = async (req, res) => {
  try {
    const applications = await applicationService.getApplicationsForPoster(req.user.userId);
    res.json(applications);
  } catch (error) {
    respondError(res, error, 'Server error');
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await applicationService.updateStatus(req.params.id, req.user.userId, req.body.status);
    res.json({ message: 'Application status updated', application });
  } catch (error) {
    respondError(res, error, 'Server error');
  }
};

const getApplicantProfile = async (req, res) => {
  try {
    const profile = await applicationService.getApplicantProfile(req.params.id, req.user.userId);
    res.json(profile);
  } catch (error) {
    respondError(res, error, 'Server error');
  }
};

module.exports = {
  getApplicantProfile,
  applyForJob,
  getUserApplications,
  getPostedApplications,
  updateApplicationStatus
};
