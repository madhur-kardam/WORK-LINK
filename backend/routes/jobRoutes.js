const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  getJobs, getJob, createJob, getPostedJobs, updateJob, deleteJob
} = require('../controllers/jobController');

const router = express.Router();

router.get('/', getJobs);                              // public
router.get('/user/posted', authMiddleware, getPostedJobs);
router.get('/:id', getJob);
router.post('/', authMiddleware, createJob);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);

module.exports = router;
