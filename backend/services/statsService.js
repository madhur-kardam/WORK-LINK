const Job = require('../models/Job');
const User = require('../models/User');

const getStats = async () => {
  const jobCount = await Job.countDocuments({ status: 'active' });
  const userCount = await User.countDocuments({ userType: 'seeker' });
  const posterCount = await User.countDocuments({ userType: 'poster' });

  return {
    activeJobs: jobCount,
    workers: userCount,
    employers: posterCount
  };
};

module.exports = { getStats };
