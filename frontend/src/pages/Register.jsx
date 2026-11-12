import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { registerUser } from '../services/authService.js';
import './Register.css';

// Email validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}$/;

// Phone validation
// Must start with 6,7,8,9 and contain exactly 10 digits
const VALID_INDIAN_MOBILE = /^[6-9][0-9]{9}$/;

// Reject numbers where all digits are the same
const SAME_DIGIT_PATTERN = /^(\d)\1{9}$/;

// Common fake/test numbers
const BLOCKED_NUMBERS = [
  '0123456789',
  '1234567890',
  '9876543210',
  '0987654321',
  '9000000000',
  '9999999999',
  '8888888888',
  '7777777777',
  '6666666666',
  '9898989898',
  '9090909090',
  '9191919191',
  '8080808080'
];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    document.title = 'Register - WorkLink';
  }, []);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const data = {
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
      password: formData.get('password'),
      userType: formData.get('userType')
    };

    if (!EMAIL_REGEX.test(data.email)) {
      showError('Please enter a valid email address (e.g. name@gmail.com)');
      setLoading(false);
      return;
    }

    const phone = data.phone;
    if (
      !VALID_INDIAN_MOBILE.test(phone) ||
      SAME_DIGIT_PATTERN.test(phone) ||
      BLOCKED_NUMBERS.includes(phone)
    ) {
      showError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    if (!data.userType) {
      showError('Please select whether you are a Job Seeker or Job Poster');
      setLoading(false);
      return;
    }

    try {
      const { ok, data: result } = await registerUser(data);

      if (ok) {
        login(result.token, result.user);

        setSuccess('Account created successfully! Redirecting...');

        setTimeout(() => {
          if (result.user.userType === 'poster') {
            navigate('/poster-dashboard');
          } else {
            navigate('/jobs');
          }
        }, 1500);
      } else {
        showError(result.error || 'Registration failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('Registration error:', err);
      showError('Network error. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="logo">🔧</div>
          <h1>Join WorkLink</h1>
          <p>Create your account to get started</p>
        </div>

        <div className="register-body">
          {error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}
          {success && <div className="success-message" style={{ display: 'block' }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" required placeholder="Enter your full name" />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" required placeholder="your.email@example.com" />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" required placeholder="+91 98765 43210" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" required placeholder="Create a strong password" minLength="6" />
            </div>

            <div className="form-group">
              <label>I am a:</label>
              <div className="user-type-selection">
                <div
                  className={`user-type-card${userType === 'seeker' ? ' selected' : ''}`}
                  onClick={() => setUserType('seeker')}
                >
                  <div className="user-type-icon">👷</div>
                  <div className="user-type-title">Job Seeker</div>
                  <div className="user-type-desc">Looking for work</div>
                  <input
                    type="radio"
                    name="userType"
                    value="seeker"
                    id="seeker"
                    required
                    checked={userType === 'seeker'}
                    onChange={() => setUserType('seeker')}
                  />
                </div>
                <div
                  className={`user-type-card${userType === 'poster' ? ' selected' : ''}`}
                  onClick={() => setUserType('poster')}
                >
                  <div className="user-type-icon">💼</div>
                  <div className="user-type-title">Job Poster</div>
                  <div className="user-type-desc">Hiring workers</div>
                  <input
                    type="radio"
                    name="userType"
                    value="poster"
                    id="poster"
                    required
                    checked={userType === 'poster'}
                    onChange={() => setUserType('poster')}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
