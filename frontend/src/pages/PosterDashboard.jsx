import { useCallback, useEffect, useRef, useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar.jsx';
import PostJobForm from '../components/PostJobForm.jsx';
import PostedJobItem from '../components/PostedJobItem.jsx';
import ApplicantCard from '../components/ApplicantCard.jsx';
import { createJob, getMyJobs, deleteJob } from '../services/jobService.js';
import { getNotifications, markAllNotificationsRead } from '../services/notificationService.js';
import './PosterDashboard.css';

export default function PosterDashboard() {
  const [jobs, setJobs] = useState(null);           // null = loading
  const [jobsError, setJobsError] = useState(false);
  const [notifications, setNotifications] = useState(null); // null = loading
  const [unreadCount, setUnreadCount] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const panelRef = useRef(null);

  useEffect(() => {
    document.title = 'Post a Job - WorkLink';
  }, []);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 5000);
  };

  // ── NOTIFICATION FUNCTIONS ──────────────────────────────────────────
  // Load notifications from the server and update the badge count
  const loadNotifications = useCallback(async () => {
    try {
      const { data } = await getNotifications();
      setUnreadCount(data.unreadCount);
      setNotifications(data.notifications);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  }, []);

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      // Refresh so unread highlights and badge count are updated
      await loadNotifications();
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  // Show/hide the notifications panel and mark as read when opened
  const openNotifications = async () => {
    if (panelOpen) {
      setPanelOpen(false);
    } else {
      setPanelOpen(true);
      // Mark all as read automatically when the poster opens the panel
      await markAllRead();
    }
  };

  useEffect(() => {
    if (panelOpen) {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [panelOpen]);

  // ── MY POSTED JOBS ────────────────────────────────────────────────
  const loadMyJobs = useCallback(async () => {
    try {
      const { data } = await getMyJobs();
      if (!Array.isArray(data)) throw new Error('Unexpected response');
      setJobs(data);
      setJobsError(false);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setJobsError(true);
    }
  }, []);

  // ── JOB FORM ───────────────────────────────────────────────────────
  const handlePostJob = async (data) => {
    setSubmitting(true);
    let posted = false;

    try {
      const { ok, data: result } = await createJob(data);

      if (ok) {
        showSuccess('Job posted successfully!');
        posted = true;
        loadMyJobs();
      } else {
        showError(result.error || 'Failed to post job');
      }
    } catch (err) {
      console.error('Error posting job:', err);
      showError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }

    return posted;
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const { ok } = await deleteJob(jobId);

      if (ok) {
        showSuccess('Job deleted successfully');
        loadMyJobs();
      } else {
        showError('Failed to delete job');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      showError('Network error. Please try again.');
    }
  };

  // ── INIT ──────────────────────────────────────────────────────────
  useEffect(() => {
    loadMyJobs();
    loadNotifications();

    // Poll for new notifications every 30 seconds (no Socket.io needed)
    // This means the badge updates automatically if a new application comes in
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadMyJobs, loadNotifications]);

  const renderJobs = () => {
    if (jobsError) {
      return <p style={{ textAlign: 'center', color: '#ef4444' }}>Error loading jobs</p>;
    }
    if (jobs === null) {
      return <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading your jobs...</p>;
    }
    if (jobs.length === 0) {
      return <p style={{ textAlign: 'center', color: '#6b7280' }}>You haven't posted any jobs yet.</p>;
    }
    return jobs.map((job) => (
      <PostedJobItem key={job._id} job={job} onDelete={handleDeleteJob} />
    ));
  };

  const renderNotifications = () => {
    if (notifications === null) {
      return <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading notifications...</p>;
    }
    if (notifications.length === 0) {
      return (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>
          No applicants yet. Once someone applies for your job, they will appear here.
        </p>
      );
    }
    return notifications.map((n) => <ApplicantCard key={n._id} notification={n} />);
  };

  return (
    <div className="poster-page">
      <DashboardNavbar>
        <button className="notif-btn" onClick={openNotifications} title="Notifications">
          🔔
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>
      </DashboardNavbar>

      <div className="container">
        <div className="page-header">
          <h1>Post a New Job</h1>
          <p>Fill in the details to find the right worker for your project</p>
        </div>

        <div className="form-section">
          <div className="section-title">Job Details</div>
          {error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}
          {success && <div className="success-message" style={{ display: 'block' }}>{success}</div>}
          <PostJobForm onSubmit={handlePostJob} submitting={submitting} />
        </div>

        {/* Notifications / Applicants Panel */}
        {panelOpen && (
          <div className="notif-panel" ref={panelRef}>
            <div className="notif-panel-header">
              <div className="section-title" style={{ marginBottom: 0 }}>🔔 Applicants</div>
              <button className="mark-read-btn" onClick={markAllRead}>Mark All as Read</button>
            </div>
            <div>{renderNotifications()}</div>
          </div>
        )}

        <div className="my-jobs-section">
          <div className="section-title">My Posted Jobs</div>
          <div className="jobs-list">{renderJobs()}</div>
        </div>
      </div>
    </div>
  );
}
