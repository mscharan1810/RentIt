import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setFormData({
        name: userInfo.name || '',
        phone: userInfo.phone || '',
        password: ''
      });
    }
  }, [navigate, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const payload = {
        name: formData.name,
        phone: formData.phone
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const { data } = await axios.put('https://server-ten-pi-36.vercel.app/api/auth/profile', payload, config);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      setMessage('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
      setLoading(false);
    } catch (error) {
      console.error('Error updating profile', error);
      setMessage('Failed to update profile. ' + (error.response?.data?.message || ''));
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="container py-5">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-link text-dark text-decoration-none d-inline-flex align-items-center mb-4 p-0 fw-medium"
      >
        <ArrowLeft size={20} className="me-2" /> Go Back
      </button>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="glass-card p-5">
            <div className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                <User size={40} />
              </div>
              <h2 className="fw-bold">Edit Profile</h2>
            </div>

            {message && (
              <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address (Cannot be changed)</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={userInfo.email}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Contact Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">New Password (leave blank to keep current)</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
