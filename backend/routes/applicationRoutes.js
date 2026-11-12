const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  applyForJob, getUserApplications, getPostedApplications, updateApplicationStatus, getApplicantProfile
} = require('../controllers/applicationController');

const router = express.Router();

router.post('/', authMiddleware, applyForJob);
router.get('/user', authMiddleware, getUserApplications);
router.get('/posted', authMiddleware, getPostedApplications);
router.get('/:id/profile', authMiddleware, getApplicantProfile);
router.put('/:id/status', authMiddleware, updateApplicationStatus);

module.exports = router;
