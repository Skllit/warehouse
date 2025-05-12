// src/pages/Product/ProductList.jsx
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { getProductsByCompany } from '../../api/product';
import { fetchCompanies } from '../../api/company';

const ProductList = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchProducts();
  }, [user.email]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Products</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Name</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Category</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Price</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>SKU</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>{product.name}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>{product.category}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>${product.price}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>{product.sku}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: product.status === 'active' ? '#28a745' : '#dc3545',
                    color: 'white'
                  }}>
                    {product.status}
                  </span>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
