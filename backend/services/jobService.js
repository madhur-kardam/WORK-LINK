const Job = require('../models/Job');
const User = require('../models/User');
const HttpError = require('./httpError');

const getActiveJobs = async ({ type, location, urgency, sort }) => {
  let query = { status: 'active' };

  if (type && type !== 'all') query.type = type;
  if (urgency && urgency !== 'all') query.urgency = urgency;
  if (location) query.location = new RegExp(location, 'i');

  let jobs = await Job.find(query);

  // Sort
  if (sort === 'wage-high') jobs.sort((a, b) => b.wage - a.wage);
  else if (sort === 'wage-low') jobs.sort((a, b) => a.wage - b.wage);
  else if (sort === 'urgency') {
    const urgencyOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
    jobs.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
  }

  return jobs;
};

const getJobById = async (id) => {
  const job = await Job.findById(id);
  if (!job) {
    throw new HttpError(404, 'Job not found');
  }
  return job;
};

const createJob = async (authUser, body) => {
  if (authUser.userType !== 'poster') {
    throw new HttpError(403, 'Only job posters can create jobs');
  }

  const user = await User.findById(authUser.userId);

  const job = new Job({
    ...body,
    userId: authUser.userId,
    postedBy: user.name,
    contact: user.phone
  });

  await job.save();
  return job;
};

const getJobsPostedBy = (userId) =>
  Job.find({ userId }).sort({ createdAt: -1 });

const updateJob = async (id, userId, body) => {
  const job = await Job.findOne({ _id: id, userId });
  if (!job) {
    throw new HttpError(404, 'Job not found or unauthorized');
  }

  Object.assign(job, body);
  await job.save();
  return job;
};

const deleteJob = async (id, userId) => {
  const job = await Job.findOneAndDelete({ _id: id, userId });
  if (!job) {
    throw new HttpError(404, 'Job not found or unauthorized');
  }
};

module.exports = {
  getActiveJobs,
  getJobById,
  createJob,
  getJobsPostedBy,
  updateJob,
  deleteJob
};
