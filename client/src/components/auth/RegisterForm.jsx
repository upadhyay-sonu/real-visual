import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { registerCall } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPassword, isValidUsername } from '../../utils/validators';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validation
    if (!isValidUsername(username)) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!isValidPassword(password)) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const data = await registerCall(username, email, password);
      login(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      // The error is already parsed cleanly by our centralized Axios interceptor
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input
            className="form-input"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            className="form-input"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            className="form-input"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
            minLength="6"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="form-input"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
            minLength="6"
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default RegisterForm;
