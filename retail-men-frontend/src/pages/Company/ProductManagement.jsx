import React, { useState, useEffect } from 'react';
import { fetchCompanyProducts, createProduct, updateProduct, deleteProduct } from '../../api/product';
import useAuth from '../../hooks/useAuth';
import jwtDecode from 'jwt-decode';

const ProductManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    costPrice: '',
    category: '',
    brand: '',
    sku: '',
    unit: 'pcs',
    status: 'Active',
    tagName: '',
    companyId: user?.id || ''
  });

  // Get the user ID from the token
  const getUserId = () => {
    const token = localStorage.getItem('token');
    console.log('Raw token:', token); // Debug log
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded); // Debug log
        const userId = decoded.id;
        console.log('Extracted user ID:', userId); // Debug log
        if (!userId) {
          console.error('No user ID found in token payload');
          return null;
        }
        return userId;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  // Initialize form data with user's company ID
  useEffect(() => {
    if (user?.id) {
      console.log('Setting companyId from user:', user.id); // Debug log
      setFormData(prev => ({
        ...prev,
        companyId: user.id
      }));
    }
  }, [user]);

  // Fetch companies when component mounts
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Function to fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/companies', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCompanies(data);
      // If user is a company user, set their company as selected
      if (user.role === 'company') {
        const userCompany = data.find(company => company._id === user.id);
        if (userCompany) {
          setSelectedCompany(userCompany);
          setFormData(prev => ({ ...prev, companyId: userCompany._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies');
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      loadProducts();
    }
  }, [selectedCompany]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      if (!selectedCompany) {
        setProducts([]);
        return;
      }
      const data = await fetchCompanyProducts(selectedCompany._id);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    const company = companies.find(c => c._id === companyId);
    setSelectedCompany(company);
    setFormData(prev => ({ ...prev, companyId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user?.id) {
        throw new Error('User ID not found. Please log in again.');
      }

      // Create a new object with all required fields
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        sku: formData.sku,
        unit: formData.unit,
        status: formData.status,
        companyId: user.id, // Use the user ID from auth context
        tagName: formData.tagName || ''
      };

      console.log('Submit - Final product data:', productData); // Debug log

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
      } else {
        const response = await createProduct(productData);
        console.log('Product creation response:', response);
      }
      
      setShowAddForm(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        costPrice: '',
        category: '',
        brand: '',
        sku: '',
        unit: 'pcs',
        status: 'Active',
        tagName: '',
        companyId: user.id // Preserve the user's ID
      });
      loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
    }
  };

  // Update the form when showAddForm changes
  useEffect(() => {
    if (showAddForm && user?.id) {
      setFormData(prev => ({
        ...prev,
        companyId: user.id
      }));
    }
  }, [showAddForm, user]);

  // Update the form when editingProduct changes
  useEffect(() => {
    if (editingProduct && user?.id) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        category: editingProduct.category,
        brand: editingProduct.brand,
        sku: editingProduct.sku,
        unit: editingProduct.unit,
        status: editingProduct.status,
        tagName: editingProduct.tagName || '',
        companyId: user.id
      });
    }
  }, [editingProduct, user]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      sku: product.sku,
      minimumStock: product.minimumStock
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        loadProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Company Products</h2>
          {selectedCompany && (
            <p className="text-gray-600 mt-1">Company: {selectedCompany.name}</p>
          )}
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              costPrice: '',
              category: '',
              brand: '',
              sku: '',
              unit: 'pcs',
              status: 'Active',
              tagName: '',
              companyId: selectedCompany?._id || ''
            });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!selectedCompany && user.role !== 'company' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Company</label>
          <select
            value={selectedCompany?._id || ''}
            onChange={handleCompanyChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU *</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost Price *</label>
              <input
                type="number"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand *</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit *</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="pcs">Pieces</option>
                <option value="pack">Pack</option>
                <option value="set">Set</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Tag Name</label>
              <input
                type="text"
                value={formData.tagName}
                onChange={(e) => setFormData({ ...formData, tagName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Optional: Add tags for clothing-related products"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingProduct(null);
                setFormData({
                  name: '',
                  description: '',
                  price: '',
                  costPrice: '',
                  category: '',
                  brand: '',
                  sku: '',
                  unit: 'pcs',
                  status: 'Active',
                  tagName: '',
                  companyId: selectedCompany?._id || ''
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-4">Loading products...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 