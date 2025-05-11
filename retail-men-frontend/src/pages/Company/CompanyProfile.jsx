import React, { useState, useEffect } from 'react';
import { createCompany, fetchCompanies } from '../../api/company';
import useAuth from '../../hooks/useAuth';

const CompanyProfile = () => {
  const { token, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    checkCompanyProfile();
  }, [token]);

  const checkCompanyProfile = async () => {
    try {
      const companies = await fetchCompanies(token);
      const userCompany = companies.find(c => c.contactEmail === user.email);
      if (userCompany) {
        setFormData({
          name: userCompany.name,
          contactPerson: userCompany.contactPerson,
          contactEmail: userCompany.contactEmail,
          contactPhone: userCompany.contactPhone,
          address: userCompany.address,
          location: userCompany.location
        });
        setHasProfile(true);
      }
    } catch (error) {
      console.error('Error checking company profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createCompany(formData, token);
      setSuccess('Company profile created successfully!');
      setHasProfile(true);
    } catch (error) {
      setError(error.message || 'Failed to create company profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Company Profile</h2>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#e8f5e9', 
          color: '#2e7d32',
          borderRadius: '4px'
        }}>
          {success}
        </div>
      )}

      {hasProfile ? (
        <div style={{ 
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Company Details</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Name:</strong> {formData.name}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Contact Person:</strong> {formData.contactPerson}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Email:</strong> {formData.contactEmail}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Phone:</strong> {formData.contactPhone}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Address:</strong> {formData.address}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Location:</strong> {formData.location}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              Company Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Enter company name"
              />
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              Contact Person:
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Enter contact person name"
              />
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              Contact Email:
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Enter contact email"
              />
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              Contact Phone:
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Enter contact phone number"
              />
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              Company Address:
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  minHeight: '100px'
                }}
                placeholder="Enter complete company address"
              />
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              Company Location:
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Enter company location (city/region)"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#1a73e8',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Company Profile'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CompanyProfile; 