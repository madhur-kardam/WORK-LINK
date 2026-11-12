export default function JobCard({ job, applied, applying, onApply }) {
  return (
    <div className="job-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div className="job-type">{job.type}</div>
        <span className={`urgency-badge urgency-${job.urgency.toLowerCase()}`}>{job.urgency}</span>
      </div>
      <div className="job-details">
        <div className="detail-row">📍 {job.location}</div>
        <div className="detail-row">⏰ {job.time}</div>
        <div className="detail-row">📅 {job.duration}</div>
        <div className="detail-row">{job.description}</div>
      </div>
      <div className="wage">₹{job.wage}/day</div>
      <button
        className={`apply-btn${applied ? ' applied' : ''}`}
        disabled={applying}
        onClick={() => onApply(job._id)}
      >
        {applying ? 'Applying...' : applied ? '✓ Applied' : 'Apply Now'}
      </button>
    </div>
  );
}
