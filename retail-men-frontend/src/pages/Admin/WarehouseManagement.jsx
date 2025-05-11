import React, { useState, useEffect, useCallback } from 'react';
import { fetchWarehouses, fetchWarehouseWithBranches, createWarehouse } from '../../api/warehouse';
import { fetchCompanies } from '../../api/company';
import authApi from '../../api/auth';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../constants/roles';

const WarehouseManagement = () => {
  const { token } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [branches, setBranches] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({
    name: '',
    location: '',
    companyId: '',
    managerId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [warehousesData, companiesData, usersData] = await Promise.all([
        fetchWarehouses(token),
        fetchCompanies(token),
        authApi.getUsers(token)
      ]);
      setWarehouses(warehousesData);
      setCompanies(companiesData);
      const managers = usersData.filter(user => user.role === 'warehouse-manager');
      setManagers(managers);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelect = async (id) => {
    setSelected(id);
    try {
      const data = await fetchWarehouseWithBranches(id, token);
      setBranches(data.branches || []);
    } catch (err) {
      console.error('Error loading branches:', err);
      setBranches([]);
    }
  };

  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createWarehouse(newWarehouse, token);
      setSuccess('Warehouse created successfully!');
      setNewWarehouse({ name: '', location: '', companyId: '', managerId: '' });
      setShowAddForm(false);
      loadData(); // Reload the warehouses list
    } catch (err) {
      console.error('Error creating warehouse:', err);
      setError('Failed to create warehouse. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Warehouse Management</h2>

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

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3>Warehouses</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showAddForm ? 'Cancel' : 'Add Warehouse'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddWarehouse} style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h4 style={{ marginBottom: '15px' }}>Add New Warehouse</h4>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Company:
                  <select
                    value={newWarehouse.companyId}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, companyId: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="">Select a company</option>
                    {companies.map(company => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Warehouse Manager:
                  <select
                    value={newWarehouse.managerId}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, managerId: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="">Select a manager</option>
                    {managers.map(manager => (
                      <option key={manager._id} value={manager._id}>
                        {manager.name} ({manager.email})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Warehouse Name:
                  <input
                    type="text"
                    value={newWarehouse.name}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, name: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Location:
                  <input
                    type="text"
                    value={newWarehouse.location}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, location: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: loading ? '#ccc' : '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Creating...' : 'Create Warehouse'}
              </button>
            </form>
          )}

          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {warehouses.map(w => (
                <li key={w._id} style={{ marginBottom: '10px' }}>
                  <button
                    onClick={() => handleSelect(w._id)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      textAlign: 'left',
                      backgroundColor: selected === w._id ? '#e3f2fd' : 'transparent',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {w.name} ({w.location})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {selected && (
          <div style={{ flex: 1 }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '15px' }}>Branches</h3>
              {branches.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {branches.map(b => (
                    <li key={b._id} style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '10px'
                    }}>
                      {b.name} ({b.location})
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#666' }}>No branches found for this warehouse.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseManagement;
