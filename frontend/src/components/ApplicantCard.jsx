import { useNavigate } from 'react-router-dom';

export default function ApplicantCard({ notification: n }) {
  const navigate = useNavigate();
  const date = new Date(n.createdAt);
  // Format: "12 Jun 2025, 3:45 PM"
  const timeStr = date.toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const handleOnClick = () => navigate(`/profile/${n.applicationId}`);

  return (
    <div className={`applicant-card ${n.isRead ? '' : 'unread'}`}>
      <div className="applicant-info">
        <div className="applicant-name"> {n.applicantName}</div>
        <div className="applicant-detail">📧 {n.applicantEmail}</div>
        <div className="applicant-detail">📞 {n.applicantPhone}</div>
        <div className="applicant-time">⏰ Applied on {timeStr}</div>
      </div>
      <div>
        <span
          className="applicant-job-tag"
          style={{ cursor: 'pointer' }}
          onClick={handleOnClick}
        > 👷 View Profile </span>
        &nbsp;
        <span className="applicant-job-tag">🔧 {n.jobType}</span>
      </div>
    </div>
  );
}