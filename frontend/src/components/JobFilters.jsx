export default function JobFilters({ filters, onChange }) {
  const handle = (name) => (e) => onChange({ ...filters, [name]: e.target.value });

  return (
    <div className="filters">
      <div className="filter-grid">
        <div className="filter-group">
          <label>Work Type</label>
          <select value={filters.type} onChange={handle('type')}>
            <option value="all">All Jobs</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Plumber">Plumber</option>
            <option value="Electrician">Electrician</option>
            <option value="Painter">Painter</option>
            <option value="Mason">Mason</option>
            <option value="Welder">Welder</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Location</label>
          <input
            type="text"
            placeholder="Search location..."
            value={filters.location}
            onChange={handle('location')}
          />
        </div>
        <div className="filter-group">
          <label>Urgency</label>
          <select value={filters.urgency} onChange={handle('urgency')}>
            <option value="all">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
