import { Link } from 'react-router-dom';
import './Navbar.css';

export default function PublicNavbar() {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">🔧 WorkLink</Link>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
