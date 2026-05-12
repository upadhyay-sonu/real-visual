import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginCall } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail } from '../../utils/validators';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginCall(email, password);
      login(data);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
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
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default LoginForm;
