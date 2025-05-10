// src/pages/WarehouseDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  fetchWarehouses,
  fetchWarehouseById
} from '../../api/warehouse';
import branchApi from '../../api/branch';
import useAuth from '../../hooks/useAuth';

function WarehouseDashboard() {
  const { token } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [branchesByWarehouse, setBranchesByWarehouse] = useState({});
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load all warehouses on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await fetchWarehouses(token);
        setWarehouses(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Error loading warehouses', err);
        setError('Failed to load warehouses');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // Toggle expand/collapse for a warehouse and fetch its branches if expanding
  const toggleExpand = async (warehouseId) => {
    const isExpanded = expanded[warehouseId];
    // If already open, just collapse
    if (isExpanded) {
      setExpanded(prev => ({ ...prev, [warehouseId]: false }));
      return;
    }

    // Otherwise fetch branches
    try {
      setLoading(true);
      setError('');
      const branchList = await branchApi.fetchBranchesByWarehouse(warehouseId, token);
      setBranchesByWarehouse(prev => ({
        ...prev,
        [warehouseId]: Array.isArray(branchList) ? branchList : []
      }));
      setExpanded(prev => ({ ...prev, [warehouseId]: true }));
    } catch (err) {
      console.error(`Error loading branches for warehouse ${warehouseId}`, err);
      setError('Failed to load branches');
      setExpanded(prev => ({ ...prev, [warehouseId]: false }));
    } finally {
      setLoading(false);
    }
  };

  if (loading && warehouses.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}>
        <p>Loading warehouses...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ 
        marginBottom: '20px', 
        color: '#333',
        fontSize: '24px',
        fontWeight: '600'
      }}>
        Warehouse Dashboard
      </h2>

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

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {warehouses.map(wh => {
          const id = wh._id || wh.id;
          const isOpen = !!expanded[id];
          const branches = branchesByWarehouse[id] || [];

          return (
            <div key={id} style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #eee'
              }}>
                <button
                  onClick={() => toggleExpand(id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  <span>{wh.name}</span>
                  <span style={{ 
                    fontSize: '14px',
                    color: '#666',
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▼
                  </span>
                </button>

                <div style={{ 
                  marginTop: '10px',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Location:</strong> {wh.location}
                  </p>
                </div>
              </div>

              {isOpen && (
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderTop: '1px solid #eee'
                }}>
                  <h4 style={{ 
                    margin: '0 0 15px 0',
                    color: '#333',
                    fontSize: '16px'
                  }}>
                    Branches
                  </h4>
                  
                  {loading ? (
                    <p style={{ color: '#666' }}>Loading branches...</p>
                  ) : branches.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gap: '10px'
                    }}>
                      {branches.map(b => {
                        const bid = b._id || b.id;
                        return (
                          <div key={bid} style={{
                            backgroundColor: '#fff',
                            padding: '12px',
                            borderRadius: '4px',
                            border: '1px solid #eee'
                          }}>
                            <p style={{ 
                              margin: '0 0 5px 0',
                              fontWeight: '500',
                              color: '#333'
                            }}>
                              {b.name}
                            </p>
                            <p style={{ 
                              margin: 0,
                              fontSize: '14px',
                              color: '#666'
                            }}>
                              {b.location}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ 
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      No branches found for this warehouse
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WarehouseDashboard;
