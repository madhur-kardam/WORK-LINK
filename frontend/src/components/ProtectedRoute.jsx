import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Where each account type belongs
const HOME = { poster: '/poster-dashboard', seeker: '/jobs' };

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  // Login is being restored (page refresh) - don't redirect yet
  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '60px', color: '#6b7280' }}>Loading...</p>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but this page is for the other account type -> send them to their own page
  if (role && user.userType !== role) {
    return <Navigate to={HOME[user.userType] || '/login'} replace />;
  }

  return children;
}
