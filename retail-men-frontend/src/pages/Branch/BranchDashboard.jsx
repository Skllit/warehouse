// src/pages/Branch/BranchDashboard.jsx
import React, { useState, useEffect } from 'react';
import branchApi from '../../api/branch';
import useAuth from '../../hooks/useAuth';

const BranchDashboard = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchStock, setBranchStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStockModal, setShowStockModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantityChange, setQuantityChange] = useState(0);
  const [restockQuantity, setRestockQuantity] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    const getBranches = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await branchApi.fetchBranches(token);
        setBranches(data || []);
      } catch (err) {
        console.error('Error loading branches:', err);
        setError('Failed to load branches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getBranches();
  }, [token]);

  const handleBranchSelect = async (branch) => {
    try {
      setLoading(true);
      setError('');
      const [branchWithWarehouse, stock] = await Promise.all([
        branchApi.fetchBranchWithWarehouse(branch._id, token),
        branchApi.fetchBranchStock(branch._id, token)
      ]);
      setSelectedBranch(branchWithWarehouse);
      setBranchStock(stock || []);
    } catch (err) {
      console.error('Error loading branch details:', err);
      setError('Failed to load branch details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjust = async () => {
    try {
      setLoading(true);
      setError('');
      await branchApi.adjustBranchStock(
        selectedBranch.branch._id,
        selectedProduct._id,
        quantityChange,
        token
      );
      // Refresh stock data
      const updatedStock = await branchApi.fetchBranchStock(selectedBranch.branch._id, token);
      setBranchStock(updatedStock || []);
      setShowStockModal(false);
      setQuantityChange(0);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error adjusting stock:', err);
      setError('Failed to adjust stock. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestockRequest = async () => {
    try {
      setLoading(true);
      setError('');
      await branchApi.createRestockRequest(
        selectedBranch.branch._id,
        selectedProduct._id,
        restockQuantity,
        token
      );
      setShowRestockModal(false);
      setRestockQuantity(0);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error creating restock request:', err);
      setError('Failed to create restock request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedBranch) {
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

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '300px 1fr',
        gap: '20px'
      }}>
        {/* Branch List */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Branches</h3>
          {branches.length === 0 ? (
            <p style={{ color: '#666' }}>No branches found</p>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '10px'
            }}>
              {branches.map((branch) => (
                <button
                  key={branch._id}
                  onClick={() => handleBranchSelect(branch)}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: selectedBranch?.branch._id === branch._id ? '#e3f2fd' : '#f5f5f5',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: '500' }}>{branch.name}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{branch.location}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Branch Details */}
        {selectedBranch && (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '20px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{selectedBranch.branch.name}</h3>
              <p style={{ margin: '5px 0', color: '#666' }}>
                <strong>Location:</strong> {selectedBranch.branch.location}
              </p>
              <p style={{ margin: '5px 0', color: '#666' }}>
                <strong>Warehouse:</strong> {selectedBranch.warehouse.name}
              </p>
            </div>

            {/* Stock Management */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h4 style={{ margin: 0 }}>Stock Management</h4>
                <button
                  onClick={() => setShowStockModal(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1a73e8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Adjust Stock
                </button>
              </div>

              {branchStock.length === 0 ? (
                <p style={{ color: '#666' }}>No stock items found</p>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '15px'
                }}>
                  {branchStock.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        border: '1px solid #eee'
                      }}
                    >
                      <div style={{ fontWeight: '500' }}>{item.product.name}</div>
                      <div style={{ color: '#666' }}>
                        Quantity: {item.quantity}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProduct(item.product);
                          setShowRestockModal(true);
                        }}
                        style={{
                          marginTop: '10px',
                          padding: '4px 8px',
                          backgroundColor: '#4caf50',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Request Restock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {showStockModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Adjust Stock</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Product</label>
              <select
                value={selectedProduct?._id || ''}
                onChange={(e) => {
                  const product = branchStock.find(item => item.product._id === e.target.value)?.product;
                  setSelectedProduct(product);
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">Select a product</option>
                {branchStock.map((item) => (
                  <option key={item.product._id} value={item.product._id}>
                    {item.product.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Quantity Change</label>
              <input
                type="number"
                value={quantityChange}
                onChange={(e) => setQuantityChange(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            <div style={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setQuantityChange(0);
                  setSelectedProduct(null);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleStockAdjust}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1a73e8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Adjust
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Request Modal */}
      {showRestockModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Request Restock</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Product</label>
              <input
                type="text"
                value={selectedProduct?.name || ''}
                disabled
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  backgroundColor: '#f5f5f5'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Requested Quantity</label>
              <input
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            <div style={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                onClick={() => {
                  setShowRestockModal(false);
                  setRestockQuantity(0);
                  setSelectedProduct(null);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRestockRequest}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchDashboard;
