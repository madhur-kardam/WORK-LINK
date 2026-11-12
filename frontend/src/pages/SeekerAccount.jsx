import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeekerNavbar from '../components/SeekerNavbar.jsx';
import ChatBox from '../components/ChatBox.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getMe } from '../services/authService.js';
import { getMyApplications } from '../services/applicationService.js';
import './SeekerAccount.css';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const formatMonthYear = (value) =>
  new Date(value).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

const STATUS_LABEL = { pending: 'Awaiting response', accepted: 'Accepted', rejected: 'Rejected' };

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

export default function SeekerAccount() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [account, setAccount] = useState(null);
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');
  const [activeId, setActiveId] = useState(null); // application whose chat is open

  useEffect(() => {
    document.title = 'My Account - WorkLink';
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [me, apps] = await Promise.all([getMe(), getMyApplications()]);
        if (!me.ok || !apps.ok || !Array.isArray(apps.data)) {
          setErrorMessage(me.data?.error || apps.data?.error || 'Failed to load account');
          setStatus('error');
          return;
        }
        setAccount(me.data);
        setApplications(apps.data);
        setStatus('ready');
      } catch (err) {
        console.error('Error loading account:', err);
        setErrorMessage('Network error. Please try again.');
        setStatus('error');
      }
    };
    load();
  }, []);

  // Responses = applications the poster has accepted/rejected.
  // Grouped by the person/company who posted the job.
  const responded = applications.filter((a) => a.status !== 'pending' && a.jobId);
  const pending = applications.filter((a) => a.status === 'pending');

  const groups = {};
  responded.forEach((a) => {
    const key = a.jobId.userId;
    if (!groups[key]) {
      groups[key] = { id: key, name: a.jobId.postedBy, phone: a.jobId.contact, items: [] };
    }
    groups[key].items.push(a);
  });
  const responders = Object.values(groups);

  // Chat is available only for accepted applications (one chat per application)
  const acceptedApps = applications.filter((a) => a.status === 'accepted' && a.jobId);
  const activeApp = acceptedApps.find((a) => a._id === activeId) || acceptedApps[0] || null;

  if (status !== 'ready') {
    return (
      <div className="account-page">
        <SeekerNavbar />
        <div className="container">
          <div className="account-card account-state">
            <p style={{ color: status === 'error' ? '#ef4444' : '#6b7280' }}>
              {status === 'loading' ? 'Loading account...' : errorMessage}
            </p>
            {status === 'error' && (
              <button className="back-btn dark" onClick={() => navigate('/jobs')}>← Back to Jobs</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const initial = account.name.trim().charAt(0).toUpperCase();

  return (
    <div className="account-page">
      <SeekerNavbar />

      {/* Account panel (below the navbar) */}
      <div className="account-panel">
        <div className="account-panel-inner">
          <div className="account-avatar">{initial}</div>
          <div className="account-panel-text">
            <div className="account-name">{account.name}</div>
            <div className="account-designation">Job Seeker</div>
          </div>
          <div className="account-panel-actions">
            <button className="back-btn" onClick={() => navigate('/jobs')}>← Back to Jobs</button>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="account-grid">
          {/* Left column */}
          <div className="account-column">
            <div className="account-card">
              <div className="section-title">Account Information</div>
              <InfoRow icon="👤" label="Full Name" value={account.name} />
              <InfoRow icon="📧" label="Email" value={account.email} />
              <InfoRow icon="📞" label="Phone" value={account.phone} />
              <InfoRow icon="🏷️" label="Account Type" value="Job Seeker" />
              <InfoRow icon="📅" label="Member Since" value={formatMonthYear(account.createdAt)} />
            </div>

            <div className="account-card">
              <div className="section-title">My Responses</div>
              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-number">{applications.length}</div>
                  <div className="stat-label">Applications Sent</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">{responded.length}</div>
                  <div className="stat-label">Responses Received</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">{acceptedApps.length}</div>
                  <div className="stat-label">Accepted</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">{pending.length}</div>
                  <div className="stat-label">Awaiting Response</div>
                </div>
              </div>
            </div>

            <div className="account-card">
              <div className="section-title">Responses From</div>
              {responders.length === 0 ? (
                <p className="empty-text">No responses yet. Employers will appear here once they respond to your applications.</p>
              ) : (
                responders.map((r) => {
                  const firstAccepted = r.items.find((a) => a.status === 'accepted');
                  return (
                    <div className="responder-card" key={r.id}>
                      <div className="responder-header">
                        <div className="responder-avatar">{r.name.trim().charAt(0).toUpperCase()}</div>
                        <div className="responder-info">
                          <div className="responder-name">{r.name}</div>
                          <div className="responder-detail">📞 {r.phone}</div>
                        </div>
                        {firstAccepted && (
                          <button className="chat-btn" onClick={() => setActiveId(firstAccepted._id)}>💬 Chat</button>
                        )}
                      </div>
                      {r.items.map((a) => (
                        <div className="response-item" key={a._id}>
                          <div>
                            <div className="response-job">🔧 {a.jobId.type}</div>
                            <div className="response-meta">📍 {a.jobId.location} • Applied {formatDate(a.createdAt)}</div>
                          </div>
                          <span className={`status-badge status-${a.status}`}>{STATUS_LABEL[a.status]}</span>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>

            <div className="account-card">
              <div className="section-title">Awaiting Response</div>
              {pending.length === 0 ? (
                <p className="empty-text">No pending applications.</p>
              ) : (
                pending.map((a) => (
                  <div className="response-item" key={a._id}>
                    <div>
                      <div className="response-job">🔧 {a.jobId ? a.jobId.type : 'Job no longer available'}</div>
                      <div className="response-meta">
                        {a.jobId ? `Posted by ${a.jobId.postedBy} • ` : ''}Applied {formatDate(a.createdAt)}
                      </div>
                    </div>
                    <span className="status-badge status-pending">{STATUS_LABEL.pending}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right column: live chat (accepted applications only) */}
          <div className="account-column">
            <div className="account-card chat-card">
              <div className="section-title">💬 Chat</div>

              {!activeApp ? (
                <p className="empty-text">You can chat with an employer once they accept your application.</p>
              ) : (
                <>
                  <div className="chat-contacts">
                    {acceptedApps.map((a) => (
                      <button
                        key={a._id}
                        className={`chat-contact${activeApp._id === a._id ? ' active' : ''}`}
                        onClick={() => setActiveId(a._id)}
                      >
                        {a.jobId.postedBy} • {a.jobId.type}
                      </button>
                    ))}
                  </div>

                  <div className="chat-with">
                    Chatting with <strong>{activeApp.jobId.postedBy}</strong> about {activeApp.jobId.type}
                  </div>

                  <ChatBox key={activeApp._id} applicationId={activeApp._id} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
