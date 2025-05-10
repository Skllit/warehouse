import React, { useState } from 'react';
import { createCompany } from '../../api/company';
import { createWarehouse } from '../../api/warehouse';
import authApi from '../../api/auth';
import useAuth from '../../hooks/useAuth';

const CompanyOnboarding = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyLocation: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    warehouseName: '',
    warehouseLocation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setError('');
  };

  const createManagerAccount = async (managerData) => {
    try {
      console.log('Creating manager account with data:', managerData);
      const result = await authApi.registerUser(managerData, token);
      return result;
    } catch (error) {
      console.error('Failed to create manager account:', error);
      throw new Error(`Failed to create manager account: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) {
      console.log('Form submission prevented - already processing');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const trimmedName = formData.companyName.trim();
    if (!trimmedName) {
      setError('Company name is required');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create the company
      console.log('Step 1: Creating company...');
      const companyResponse = await createCompany({
        name: trimmedName,
        location: formData.companyLocation.trim(),
        contactPerson: formData.contactPerson.trim(),
        contactEmail: formData.contactEmail.trim(),
        contactPhone: formData.contactPhone.trim(),
        address: formData.address.trim()
      }, token);

      console.log('Company creation successful:', companyResponse);

      const companyId = companyResponse?.company?._id || 
                       companyResponse?.data?._id || 
                       companyResponse?._id;
      
      if (!companyId) {
        throw new Error('Failed to get company ID from response');
      }

      // Step 2: Create manager account
      console.log('Step 2: Creating manager account...');
      const managerId = await createManagerAccount(formData);

      // Step 3: Create warehouse
      console.log('Step 3: Creating warehouse...');
      await createWarehouse({
        name: formData.warehouseName.trim(),
        location: formData.warehouseLocation.trim(),
        companyId: companyId,
        managerId: managerId
      }, token);

      console.log('All steps completed successfully');

      // Reset form and show success message
      setFormData({
        companyName: '',
        companyLocation: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        warehouseName: '',
        warehouseLocation: ''
      });
      setSuccess('Company, manager account, and warehouse created successfully!');
    } catch (error) {
      console.error('Error in form submission:', error);
      setError(error.message || 'Failed to complete the onboarding process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Company Onboarding</h2>
      
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

      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Company Details</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              Company Name:
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
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
                name="companyLocation"
                value={formData.companyLocation}
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
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Initial Warehouse</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              Warehouse Name:
              <input
                type="text"
                name="warehouseName"
                value={formData.warehouseName}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Enter warehouse name"
              />
            </label>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              Warehouse Location:
              <input
                type="text"
                name="warehouseLocation"
                value={formData.warehouseLocation}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Enter warehouse location"
              />
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '0.75rem 1.5rem',
            backgroundColor: loading ? '#ccc' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? 'Creating...' : 'Create Company and Warehouse'}
        </button>
      </form>
    </div>
  );
};

export default CompanyOnboarding; 