import { useState } from 'react';

const EMPTY_JOB = {
  type: '',
  urgency: '',
  location: '',
  time: '',
  duration: '',
  wage: '',
  address: '',
  description: ''
};

// Calls onSubmit(data) -> resolves true when the job was posted (form is then reset)
export default function PostJobForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(EMPTY_JOB);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const posted = await onSubmit(form);
    if (posted) setForm(EMPTY_JOB);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Job Type *</label>
          <select name="type" required value={form.type} onChange={handleChange}>
            <option value="">Select job type</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Plumber">Plumber</option>
            <option value="Electrician">Electrician</option>
            <option value="Painter">Painter</option>
            <option value="Mason">Mason</option>
            <option value="Welder">Welder</option>
            <option value="AC Technician">AC Technician</option>
            <option value="Tile Fitter">Tile Fitter</option>
            <option value="Gardener">Gardener</option>
            <option value="Cleaning Staff">Cleaning Staff</option>
          </select>
        </div>
        <div className="form-group">
          <label>Urgency Level *</label>
          <select name="urgency" required value={form.urgency} onChange={handleChange}>
            <option value="">Select urgency</option>
            <option value="High">High (Urgent)</option>
            <option value="Medium">Medium</option>
            <option value="Low">Flexible</option>
          </select>
        </div>
        <div className="form-group">
          <label>Location/Area *</label>
          <input type="text" name="location" required placeholder="e.g., MG Road, Pithumpur" value={form.location} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Start Time *</label>
          <input type="text" name="time" required placeholder="e.g., Today 2 PM, Tomorrow morning" value={form.time} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Duration *</label>
          <input type="text" name="duration" required placeholder="e.g., 2-3 days, 1 week" value={form.duration} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Daily Wage (₹) *</label>
          <input type="number" name="wage" required placeholder="Enter daily wage amount" min="0" value={form.wage} onChange={handleChange} />
        </div>
        <div className="form-group full-width">
          <label>Full Address *</label>
          <input type="text" name="address" required placeholder="Complete address with landmarks" value={form.address} onChange={handleChange} />
        </div>
        <div className="form-group full-width">
          <label>Job Description *</label>
          <textarea name="description" required placeholder="Describe the work to be done in detail..." value={form.description} onChange={handleChange}></textarea>
        </div>
      </div>
      <button type="submit" className="submit-btn" disabled={submitting}>
        {submitting ? 'Posting Job...' : 'Post Job'}
      </button>
    </form>
  );
}
