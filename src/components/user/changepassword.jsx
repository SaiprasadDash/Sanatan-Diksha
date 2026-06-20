'use client';

import { useState } from 'react';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear messages when user starts typing again
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    console.log('Password change form submitted:', formData);
    // Here you would typically send the data to an API
    setSuccess('Password changed successfully!');
    
    // Reset form
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleCancel = () => {
    // Redirect to the profile page
    window.location.href = '/profile';
  };

  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card w-100">
              <div className="card-body">
                <div className="row mb-4" style={{ backgroundColor: '#4D44B5', padding: '5px', borderRadius: '8px' }}>
                  <div className="col-md-6 d-flex align-items-center">
                    <h5 className="mb-0" style={{ fontWeight: '800', color: '#fff' }}>
                      Change Password
                    </h5>
                  </div>
                  <div className="col-md-6 d-flex justify-content-end align-items-center">
                    <a className="btn btn-sm" href='/admin/dashboard'>
                      <button className="btn btn-danger">Back</button>
                    </a>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row justify-content-center">
                    <div className="col-md-6">
                      <div className="mb-4">
                        <label htmlFor="currentPassword" className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          required
                        />
                        <small className="form-text text-muted">
                          Password must be at least 8 characters long.
                        </small>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="d-flex justify-content-start mt-4">
                        <button 
                          type="button" 
                          className="btn btn-secondary me-2" 
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#4D44B5' }}>
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;