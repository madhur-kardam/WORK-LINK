const jobService = require('../services/jobService');
const respondError = require('./respondError');

// Get all jobs (public)
const getJobs = async (req, res) => {
  try {
    const jobs = await jobService.getActiveJobs(req.query);
    res.json(jobs);
  } catch (error) {
    respondError(res, error, 'Server error fetching jobs', 'Get jobs error:');
  }
};

// Get single job
const getJob = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.json(job);
  } catch (error) {
    respondError(res, error, 'Server error');
  }
};

// Create job (poster only)
const createJob = async (req, res) => {
  try {
    const job = await jobService.createJob(req.user, req.body);
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    respondError(res, error, 'Server error creating job', 'Create job error:');
  }
};

// Get user's posted jobs
const getPostedJobs = async (req, res) => {
  try {
    const jobs = await jobService.getJobsPostedBy(req.user.userId);
    res.json(jobs);
  } catch (error) {
    respondError(res, error, 'Server error');
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.user.userId, req.body);
    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    respondError(res, error, 'Server error');
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    await jobService.deleteJob(req.params.id, req.user.userId);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    respondError(res, error, 'Server error');
  }
};

module.exports = { getJobs, getJob, createJob, getPostedJobs, updateJob, deleteJob };
