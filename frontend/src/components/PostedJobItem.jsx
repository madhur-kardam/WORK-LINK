export default function PostedJobItem({ job, onDelete }) {
  return (
    <div className="job-item">
      <div className="job-item-header">
        <div className="job-item-title">{job.type}</div>
        <div className="job-item-actions">
          <button className="btn-small btn-delete" onClick={() => onDelete(job._id)}>Delete</button>
        </div>
      </div>
      <div className="job-item-info">
        📍 {job.location}<br />
        ⏰ {job.time}<br />
        📅 Duration: {job.duration}<br />
        🔔 Urgency: {job.urgency}<br />
        📝 {job.description}
      </div>
      <div className="job-item-wage">₹{job.wage}/day</div>
    </div>
  );
}
