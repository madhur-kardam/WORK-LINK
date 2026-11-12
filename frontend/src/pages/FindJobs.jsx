import { useEffect, useState } from 'react';
import SeekerNavbar from '../components/SeekerNavbar.jsx';
import JobFilters from '../components/JobFilters.jsx';
import JobCard from '../components/JobCard.jsx';
import { getJobs } from '../services/jobService.js';
import { applyForJob } from '../services/applicationService.js';
import './FindJobs.css';

export default function FindJobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [filters, setFilters] = useState({ type: 'all', location: '', urgency: 'all' });
  const [appliedIds, setAppliedIds] = useState([]);
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    document.title = 'Find Jobs - WorkLink';
  }, []);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { data } = await getJobs();
        if (!Array.isArray(data)) throw new Error('Unexpected response');
        setAllJobs(data);
        setStatus('ready');
      } catch (error) {
        console.error('Error loading jobs:', error);
        setStatus('error');
      }
    };
    loadJobs();
  }, []);

  const location = filters.location.toLowerCase();
  const filteredJobs = allJobs.filter((job) => {
    const matchType = filters.type === 'all' || job.type === filters.type;
    const matchLocation = location === '' || job.location.toLowerCase().includes(location);
    const matchUrgency = filters.urgency === 'all' || job.urgency === filters.urgency;
    return matchType && matchLocation && matchUrgency;
  });

  const handleApply = async (jobId) => {
    if (appliedIds.includes(jobId)) return;

    setApplyingId(jobId);

    try {
      const { ok, data: result } = await applyForJob(jobId);

      if (ok) {
        setAppliedIds((ids) => [...ids, jobId]);
        alert('Application submitted successfully!');

        // Store for receipt
        localStorage.setItem('selectedJob', JSON.stringify(result.job));
        localStorage.setItem('applicationData', JSON.stringify(result.application));
      } else {
        alert(result.error || 'Application failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setApplyingId(null);
    }
  };

  const renderJobs = () => {
    if (status === 'loading') return <p style={{ textAlign: 'center' }}>Loading jobs...</p>;
    if (status === 'error') return <p>Error loading jobs</p>;
    if (filteredJobs.length === 0) return <p style={{ textAlign: 'center' }}>No jobs found</p>;

    return filteredJobs.map((job) => (
      <JobCard
        key={job._id}
        job={job}
        applied={appliedIds.includes(job._id)}
        applying={applyingId === job._id}
        onApply={handleApply}
      />
    ));
  };

  return (
    <div className="find-jobs-page">
      <SeekerNavbar />

      <div className="container">
        <div className="header">
          <h1>Find Your Next Opportunity</h1>
          <p>Browse and apply for jobs in Pithumpur</p>
        </div>

        <JobFilters filters={filters} onChange={setFilters} />

        <div className="jobs-container">{renderJobs()}</div>
      </div>
    </div>
  );
}
