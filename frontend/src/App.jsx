import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Contact from './pages/Contact.jsx';
import FindJobs from './pages/FindJobs.jsx';
import PosterDashboard from './pages/PosterDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ApplicantProfile from './pages/ApplicantProfile.jsx';
import SeekerAccount from './pages/SeekerAccount.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute role="seeker">
            <FindJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/poster-dashboard"
        element={
          <ProtectedRoute role="poster">
            <PosterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
       path="/profile/:applicationId"
       element={<ProtectedRoute role="poster"><ApplicantProfile /></ProtectedRoute>}
      />
      <Route
       path="/account"
       element={<ProtectedRoute role="seeker"><SeekerAccount /></ProtectedRoute>}
      />
    </Routes>
  );
}
