import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      window.location.href = '/dashboard';
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container py-5">
      <div className="auth-card">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Create Account</h2>
          <p className="text-muted">Join the sharing economy today</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-semibold">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <label className="form-label fw-semibold">Password</label>
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
            Create Account
          </button>
          
          <p className="text-center text-muted mb-0">
            Already have an account? <Link to="/login" className="text-primary fw-semibold text-decoration-none">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
