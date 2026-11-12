import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar.jsx';
import './Home.css';

const TOP_STATS = [
  { number: '150+', label: 'Active Jobs' },
  { number: '500+', label: 'Workers Hired' },
  { number: '200+', label: 'Employers' }
];

const FEATURES = [
  { icon: '🤝', title: 'Trust & Transparency', text: 'We verify all job postings and maintain transparent communication between workers and employers, ensuring a safe and reliable experience for everyone.' },
  { icon: '⚡', title: 'Quick Connections', text: 'Our platform enables instant connections between workers and employers, reducing the time it takes to find work or hire skilled professionals.' },
  { icon: '💰', title: 'Fair Wages', text: 'We promote fair compensation for workers and help employers understand market rates, ensuring everyone gets a fair deal.' },
  { icon: '📱', title: 'Easy to Use', text: 'Our simple, intuitive platform is designed for everyone - no technical expertise required. Find jobs or workers in just a few clicks.' },
  { icon: '🔍', title: 'Smart Filtering', text: 'Advanced search and filter options help workers find jobs that match their skills and employers find workers with the right expertise.' },
  { icon: '🌟', title: 'Community Focus', text: "We're committed to building a strong, supportive community of workers and employers who help each other succeed." }
];

const IMPACT = [
  { number: '500+', label: 'Workers Employed' },
  { number: '200+', label: 'Active Employers' },
  { number: '1500+', label: 'Jobs Completed' },
  { number: '95%', label: 'Satisfaction Rate' }
];

export default function Home() {
  useEffect(() => {
    document.title = 'WorkLink - Find Daily Work';
  }, []);

  return (
    <div className="home-page">
      <PublicNavbar />

      <div className="container">
        <div className="header">
          <h1>Find Your Next Opportunity</h1>
          <p>Connect with local employers in Pithumpur</p>
        </div>

        <div className="stats">
          {TOP_STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="container">
          <div className="hero-section">
            <h1>About WorkLink</h1>
            <p>Connecting skilled workers with opportunities and helping employers find the right talent for their projects in Pithumpur</p>
          </div>

          <div className="content-section">
            <h2><span>📖</span> Our Story</h2>
            <p>
              WorkLink was founded with a simple yet powerful vision: to bridge the gap between skilled grey-collar workers and employers in Pithumpur. We understand the challenges that both workers and employers face - workers struggle to find consistent work opportunities, while employers often find it difficult to locate reliable, skilled workers when they need them.
            </p>
            <p>
              Our platform was created to solve these challenges by providing a digital marketplace where workers can showcase their skills and find daily work opportunities, while employers can quickly connect with verified professionals for their projects. Since our inception, we've successfully facilitated thousands of job placements and helped build a stronger, more connected community.
            </p>
          </div>

          <div className="mission-vision">
            <div className="mv-card">
              <h3><span>🎯</span> Our Mission</h3>
              <p>
                To empower skilled workers by providing them with consistent job opportunities and fair wages, while helping employers find reliable talent efficiently. We strive to create a transparent, trustworthy platform that benefits both workers and employers equally.
              </p>
            </div>
            <div className="mv-card">
              <h3><span>👁️</span> Our Vision</h3>
              <p>
                To become the leading platform for grey-collar job connections across India, setting the standard for worker empowerment, employer satisfaction, and community development. We envision a future where every skilled worker has access to dignified work opportunities.
              </p>
            </div>
          </div>

          <div className="content-section">
            <h2><span>✨</span> What Makes Us Different</h2>
            <div className="features-grid">
              {FEATURES.map((f) => (
                <div className="feature-card" key={f.title}>
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="content-section">
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>📊 Our Impact</h2>
            <div className="stats-section">
              {IMPACT.map((s) => (
                <div className="stat-box" key={s.label}>
                  <div className="stat-number">{s.number}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="cta-section">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of workers and employers who trust WorkLink for their job needs</p>
            <Link to="/register" className="cta-button">Find Jobs Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
