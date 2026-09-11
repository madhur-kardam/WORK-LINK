const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));


// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['seeker', 'poster'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Job Schema
const jobSchema = new mongoose.Schema({
  type: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  urgency: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  wage: { type: Number, required: true },
  postedBy: { type: String, required: true },
  contact: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);

// Application Schema
const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  applicantPhone: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  applicationId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'responded'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Notification Schema
const notificationSchema = new mongoose.Schema({
  posterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // who receives the notification (job poster)
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobType: { type: String, required: true },         // e.g. "Carpenter" - stored directly so we don't need to re-query
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  applicantPhone: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, userType } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      userType
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== JOB ROUTES ====================

// Get all jobs (public)
app.get('/api/jobs', async (req, res) => {
  try {
    const { type, location, urgency, sort } = req.query;
    
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
    
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Server error fetching jobs' });
  }
});

// Get single job
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create job (poster only)
app.post('/api/jobs', authMiddleware, async (req, res) => {
  try {
    if (req.user.userType !== 'poster') {
      return res.status(403).json({ error: 'Only job posters can create jobs' });
    }

    const user = await User.findById(req.user.userId);
    
    const job = new Job({
      ...req.body,
      userId: req.user.userId,
      postedBy: user.name,
      contact: user.phone
    });

    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Server error creating job' });
  }
});

// Get user's posted jobs
app.get('/api/jobs/user/posted', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update job
app.put('/api/jobs/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!job) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete job
app.delete('/api/jobs/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!job) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== APPLICATION ROUTES ====================

// Apply for job
app.post('/api/applications', authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.user.userId);

    // Check if already applied
    const existingApp = await Application.findOne({ jobId, userId: req.user.userId });
    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Generate application ID
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const applicationId = `WL-2025-${String(timestamp).slice(-5)}${String(random).toString().padStart(4, '0')}`;

    const application = new Application({
      jobId,
      userId: req.user.userId,
      applicantName: user.name,
      applicantEmail: user.email,
      applicantPhone: user.phone,
      applicationId
    });

    await application.save();
    
    const job = await Job.findById(jobId);

    // Create a notification for the job poster
    const notification = new Notification({
      posterId: job.userId,
      applicationId: application._id,
      jobId: job._id,
      jobType: job.type,
      applicantName: user.name,
      applicantEmail: user.email,
      applicantPhone: user.phone
    });
    await notification.save();

    res.status(201).json({ 
      message: 'Application submitted successfully',
      application,
      job
    });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ error: 'Server error submitting application' });
  }
});

// Get user's applications
app.get('/api/applications/user', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.userId })
      .populate('jobId')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get applications for poster's jobs
app.get('/api/applications/posted', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.userId });
    const jobIds = jobs.map(job => job._id);
    
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update application status
app.put('/api/applications/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId');
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    // Check if user owns the job
    if (application.jobId.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    application.status = status;
    await application.save();
    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== NOTIFICATION ROUTES ====================

// Get all notifications for the logged-in poster
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ posterId: req.user.userId })
      .sort({ createdAt: -1 }); // newest first
    
    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
});

// Mark all unread notifications as read
app.put('/api/notifications/mark-read', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { posterId: req.user.userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Server error marking notifications as read' });
  }
});

// ==================== CONTACT ROUTES ====================

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Server error sending message' });
  }
});

// Get all contacts (admin only - you can add admin role later)
app.get('/api/contact', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== STATS ROUTES ====================

app.get('/api/stats', async (req, res) => {
  try {
    const jobCount = await Job.countDocuments({ status: 'active' });
    const userCount = await User.countDocuments({ userType: 'seeker' });
    const posterCount = await User.countDocuments({ userType: 'poster' });
    
    res.json({
      activeJobs: jobCount,
      workers: userCount,
      employers: posterCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});