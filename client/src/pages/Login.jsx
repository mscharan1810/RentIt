import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      window.location.href = '/dashboard';
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Welcome Back</h2>
          <p className="text-muted">Login to manage your rentals</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-semibold">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label fw-semibold d-flex justify-content-between">
              Password
              <a href="#" className="text-primary small text-decoration-none">Forgot?</a>
            </label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-100 py-3 mb-4">
            Sign In
          </button>
          
          <p className="text-center text-muted mb-0">
            Don't have an account? <Link to="/register" className="text-primary fw-semibold text-decoration-none">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
