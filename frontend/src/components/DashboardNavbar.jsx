import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';

// Navbar for logged-in pages. `children` render between the welcome text and Logout
// (the poster dashboard puts the notification bell there).
export default function DashboardNavbar({ children }) {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo">🔧 WorkLink</div>
        <div className="nav-right">
          <div className="user-info">Welcome, {user.name}</div>
          {children}
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
