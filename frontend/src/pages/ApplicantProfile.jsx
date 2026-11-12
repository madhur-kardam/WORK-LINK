import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar.jsx';
import ChatBox from '../components/ChatBox.jsx';
import { getApplicantProfile, updateApplicationStatus } from '../services/applicationService.js';
import './ApplicantProfile.css';

const formatDateTime = (value) =>
  new Date(value).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

const formatMonthYear = (value) =>
  new Date(value).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

const USER_TYPE_LABEL = { seeker: 'Job Seeker', poster: 'Job Poster' };

function InfoRow({ icon, label, value }) {
  return (
    <div className="info-row">
      <span className="info-row-icon">{icon}</span>
      <div>
        <div className="info-row-label">{label}</div>
        <div className="info-row-value">{value}</div>
      </div>
    </div>
  );
}

export default function ApplicantProfile() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.title = 'Applicant Profile - WorkLink';
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      setStatus('loading');
      try {
        const { ok, data } = await getApplicantProfile(applicationId);
        if (ok) {
          setProfile(data);
          setStatus('ready');
        } else {
          setErrorMessage(data.error || 'Failed to load profile');
          setStatus('error');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setErrorMessage('Network error. Please try again.');
        setStatus('error');
      }
    };
    loadProfile();
  }, [applicationId]);

  const backToDashboard = () => navigate('/poster-dashboard');

  // Accept / Reject the application (chat unlocks only when accepted)
  const changeStatus = async (newStatus) => {
    if (newStatus === 'rejected' && !confirm('Reject this application? Chat will be locked.')) return;

    setUpdating(true);
    try {
      const { ok, data } = await updateApplicationStatus(applicationId, newStatus);
      if (ok) {
        setProfile((prev) => ({
          ...prev,
          application: { ...prev.application, status: newStatus }
        }));
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Network error. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (status !== 'ready') {
    return (
      <div className="profile-page">
        <DashboardNavbar />
        <div className="container">
          <div className="profile-card profile-state">
            <p style={{ color: status === 'error' ? '#ef4444' : '#6b7280' }}>
              {status === 'loading' ? 'Loading profile...' : errorMessage}
            </p>
            {status === 'error' && (
              <button className="back-btn dark" onClick={backToDashboard}>← Back to Dashboard</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const { applicant, application, job } = profile;
  const designation = USER_TYPE_LABEL[applicant.userType] || applicant.userType;
  const initial = applicant.name.trim().charAt(0).toUpperCase();
  const firstName = applicant.name.trim().split(' ')[0];

  return (
    <div className="profile-page">
      <DashboardNavbar />

      {/* Profile panel (below the main navbar) */}
      <div className="profile-panel">
        <div className="profile-panel-inner">
          <div className="profile-avatar">{initial}</div>
          <div className="profile-panel-text">
            <div className="profile-name">{applicant.name}</div>
            <div className="profile-designation">
              {designation}{job ? ` • Applied for ${job.type}` : ''}
            </div>
          </div>
          <div className="profile-panel-actions">
            <span className={`status-badge status-${application.status}`}>{application.status}</span>
            {application.status !== 'accepted' && (
              <button className="accept-btn" disabled={updating} onClick={() => changeStatus('accepted')}>
                ✓ Accept
              </button>
            )}
            {application.status !== 'rejected' && (
              <button className="reject-btn" disabled={updating} onClick={() => changeStatus('rejected')}>
                ✕ Reject
              </button>
            )}
            <button className="back-btn" onClick={backToDashboard}>← Back to Dashboard</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="profile-grid">
          {/* Left column: information cards */}
          <div className="profile-column">
            <div className="profile-card">
              <div className="section-title">Contact Information</div>
              <InfoRow icon="👤" label="Full Name" value={applicant.name} />
              <InfoRow icon="📧" label="Email" value={applicant.email} />
              <InfoRow icon="📞" label="Phone" value={applicant.phone} />
            </div>

            <div className="profile-card">
              <div className="section-title">Account Details</div>
              <InfoRow icon="🏷️" label="Account Type" value={designation} />
              <InfoRow icon="📅" label="Member Since" value={formatMonthYear(applicant.createdAt)} />
            </div>

            <div className="profile-card">
              <div className="section-title">Application Details</div>
              <InfoRow icon="🆔" label="Application ID" value={application.applicationId} />
              <InfoRow icon="⏰" label="Applied On" value={formatDateTime(application.createdAt)} />
              <InfoRow icon="📌" label="Status" value={application.status} />
            </div>

            <div className="profile-card">
              <div className="section-title">Job Applied For</div>
              {job ? (
                <>
                  <InfoRow icon="🔧" label="Job Type" value={job.type} />
                  <InfoRow icon="📍" label="Location" value={job.location} />
                  <InfoRow icon="🏠" label="Address" value={job.address} />
                  <InfoRow icon="⏰" label="Start Time" value={job.time} />
                  <InfoRow icon="📅" label="Duration" value={job.duration} />
                  <InfoRow icon="🔔" label="Urgency" value={job.urgency} />
                  <InfoRow icon="💰" label="Daily Wage" value={`₹${job.wage}/day`} />
                  <InfoRow icon="📝" label="Description" value={job.description} />
                </>
              ) : (
                <p className="empty-text">This job is no longer available.</p>
              )}
            </div>
          </div>

          {/* Right column: live chat (unlocked only when accepted) */}
          <div className="profile-column">
            <div className="profile-card chat-card">
              <div className="section-title">💬 Chat with {firstName}</div>
              {application.status === 'accepted' ? (
                <ChatBox applicationId={applicationId} />
              ) : (
                <p className="empty-text">
                  Accept this application to start chatting with {firstName}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
