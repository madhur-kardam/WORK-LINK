import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';
import './SeekerNavbar.css';

// Navbar for the job seeker pages: account circle (opens /account) replaces Logout
export default function SeekerNavbar() {
  const { user } = useAuth();
  const initial = user.name.trim().charAt(0).toUpperCase();

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/jobs" className="logo">🔧 WorkLink</Link>
        <div className="nav-right">
          <div className="user-info">Welcome, {user.name}</div>
          <Link to="/account" className="account-icon" title="My Account">{initial}</Link>
        </div>
      </div>
    </nav>
  );
}
