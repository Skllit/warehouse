import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { createProduct, getProductsByCompany, updateProduct, deleteProduct } from '../../api/product';
import { fetchCompanies } from '../../api/company';

const ProductManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    costPrice: '',
    sku: '',
    unit: '',
    status: 'active'
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const fetchCompanyAndProducts = async () => {
      try {
        const companies = await fetchCompanies();
        const userCompany = companies.find(c => c.contactEmail === user.email);
        if (userCompany) {
          setCompanyId(userCompany._id);
          const productsData = await getProductsByCompany(userCompany._id);
          setProducts(productsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyAndProducts();
  }, [user.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, { ...formData, companyId });
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...formData } : p));
      } else {
        const newProduct = await createProduct({ ...formData, companyId });
        setProducts(prev => [...prev, newProduct]);
      }
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        costPrice: '',
        sku: '',
        unit: '',
        status: 'active'
      });
      setEditingProduct(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      costPrice: product.costPrice,
      sku: product.sku,
      unit: product.unit,
      status: product.status
    });
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setProducts(prev => prev.filter(p => p._id !== productId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cost Price:</label>
          <input
            type="number"
            name="costPrice"
            value={formData.costPrice}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>SKU:</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Unit:</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                name: '',
                description: '',
                category: '',
                price: '',
                costPrice: '',
                sku: '',
                unit: '',
                status: 'active'
              });
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '1rem'
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Product List</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Name</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Category</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Price</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>SKU</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Actions</th>
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
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#1a73e8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '0.5rem'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement; 