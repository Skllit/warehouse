// src/pages/BranchDashboard.jsx
import React, { useState, useEffect } from 'react';
import branchApi from '../../api/branch';
import useAuth from '../../hooks/useAuth';

const BranchDashboardComponent = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const getBranches = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await branchApi.fetchBranches(token);
        setBranches(data.data || []);
      } catch (err) {
        console.error('Error loading branches:', err);
        setError('Failed to load branches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getBranches();
  }, [token]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}>
        <p>Loading branches...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          margin: 0,
          color: '#333',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Branch Dashboard
        </h2>
        <div style={{ 
          color: '#666',
          fontSize: '14px'
        }}>
          Total Branches: {branches.length}
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '20px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}

      {branches.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          color: '#666'
        }}>
          No branches found
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {branches.map((branch, index) => (
            <div key={branch.id ?? index} style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '20px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}>
              <h3 style={{ 
                margin: '0 0 10px 0',
                color: '#333',
                fontSize: '18px',
                fontWeight: '500'
              }}>
                {branch.name}
              </h3>
              <div style={{ 
                color: '#666',
                fontSize: '14px',
                marginBottom: '15px'
              }}>
                <p style={{ margin: '5px 0' }}>
                  <strong>Location:</strong> {branch.location}
                </p>
                {branch.warehouseId && (
                  <p style={{ margin: '5px 0' }}>
                    <strong>Warehouse ID:</strong> {branch.warehouseId}
                  </p>
                )}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '15px',
                borderTop: '1px solid #eee'
              }}>
                <span style={{
                  fontSize: '12px',
                  color: '#666',
                  backgroundColor: '#f5f5f5',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  Branch ID: {branch.id ?? 'N/A'}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: '#666',
                  backgroundColor: '#e3f2fd',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  Status: {branch.status || 'Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BranchDashboard = BranchDashboardComponent;
export default BranchDashboard;
