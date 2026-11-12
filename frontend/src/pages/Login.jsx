import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { loginUser } from '../services/authService.js';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    document.title = 'Login - WorkLink';
  }, []);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    try {
      const { ok, data: result } = await loginUser(data);

      if (ok) {
        // Store token and user data
        login(result.token, result.user);

        showSuccess('Login successful! Redirecting...');

        // Redirect based on user type
        setTimeout(() => {
          if (result.user.userType === 'poster') {
            navigate('/poster-dashboard');
          } else {
            navigate('/jobs');
          }
        }, 1000);
      } else {
        showError(result.error || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      showError('Network error. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">🔧</div>
          <h1>Welcome Back</h1>
          <p>Login to find your next opportunity</p>
        </div>

        <div className="login-body">
          {error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}
          {success && <div className="success-message" style={{ display: 'block' }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" required placeholder="your.email@example.com" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-toggle">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Enter your password"
                />
                <button type="button" className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>👁️</button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="register-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
