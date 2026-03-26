import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import './Auth.css';
import Spinner from '../components/common/Spinner';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(formData);
      loginUser(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative vintage background text */}
      <div className="auth-bg-text">PaperClip</div>

      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-logo">PaperClip</h1>
          <p className="auth-tagline">— your thoughts, preserved —</p>
        </div>

        <hr className="divider" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <h2 className="auth-title">Welcome Back</h2>

          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <hr className="divider" />

        <p className="auth-switch">
          New here?{' '}
          <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;