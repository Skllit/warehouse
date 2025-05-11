// src/pages/StockOverview.jsx
import React, { useState, useEffect } from 'react';
import { fetchStock } from '../../api/stock';
import { getProductsByCompany } from '../../api/product';
import { fetchCompanies } from '../../api/company';
import useAuth from '../../hooks/useAuth';

// Sample product images (you should replace these with actual product images)
const productImages = {
  'tshirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  'jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  'shirt': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  'jacket': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  'default': 'https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
};

export const StockOverview = () => {
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token, user } = useAuth();

  useEffect(() => {
    const getStock = async () => {
      try {
        const data = await fetchStock(token);
        setStock(data.data || []);
      } catch (error) {
        console.error('Error fetching stock:', error);
        setError('Failed to fetch stock data');
      }
    };

    const fetchProducts = async () => {
      try {
        const companies = await fetchCompanies();
        const userCompany = companies.find(c => c.contactEmail === user.email);
        if (userCompany) {
          const productsData = await getProductsByCompany(userCompany._id);
          setProducts(productsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getStock();
    fetchProducts();
  }, [token, user.email]);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleStockUpdate = async (productId, change) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Here you would typically call an API to update the stock
      // For now, we'll just update the local state
      setStock(prevStock => 
        prevStock.map(item => 
          item.productId === productId 
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
      );
      setSuccess(`Stock updated successfully`);
    } catch (error) {
      console.error('Error updating stock:', error);
      setError('Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (productName) => {
    if (!productName) return productImages.default;
    
    const lowerName = productName.toLowerCase();
    for (const [key, url] of Object.entries(productImages)) {
      if (lowerName.includes(key)) {
        return url;
      }
    }
    return productImages.default;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Stock Overview</h2>

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

      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '10px',
          color: '#666'
        }}>
          Filter by Product:
          <select 
            value={selectedProduct} 
            onChange={handleProductChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              marginTop: '5px'
            }}
          >
            <option value="">All Products</option>
            {products.map((prod) => (
              <option key={prod._id || prod.id} value={prod._id || prod.id}>
                {prod.name || 'Unnamed Product'}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {stock
          .filter((item) => !selectedProduct || item.productId === selectedProduct)
          .map((item) => {
            const product = products.find(p => (p._id || p.id) === item.productId) || {};
            return (
              <div key={item._id || item.id} style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '200px',
                  backgroundImage: `url(${getProductImage(product.name)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
                
                <div style={{ padding: '15px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    {product.name || 'Unknown Product'}
                  </h3>
                  
                  <p style={{ 
                    margin: '0 0 15px 0',
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    Current Stock: {item.quantity || 0}
                  </p>

                  {user?.role === 'warehouse-manager' && (
                    <div style={{ 
                      display: 'flex',
                      gap: '10px',
                      marginTop: '10px'
                    }}>
                      <button
                        onClick={() => handleStockUpdate(item.productId, -1)}
                        disabled={loading || (item.quantity || 0) <= 0}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: (item.quantity || 0) <= 0 ? 'not-allowed' : 'pointer',
                          opacity: (item.quantity || 0) <= 0 ? 0.5 : 1
                        }}
                      >
                        Decrease
                      </button>
                      <button
                        onClick={() => handleStockUpdate(item.productId, 1)}
                        disabled={loading}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Increase
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default StockOverview;
