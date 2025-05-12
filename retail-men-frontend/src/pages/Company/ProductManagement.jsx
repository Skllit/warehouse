import React, { useState, useEffect } from 'react';
import { fetchCompanyProducts, createProduct, updateProduct, deleteProduct } from '../../api/product';
import useAuth from '../../hooks/useAuth';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const navigate = useNavigate();
  const { user, token, companyId } = useAuth();
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
    companyId: companyId?.toString() || ''
  });

  // Check auth state
  useEffect(() => {
    console.log('=== Debug Auth Check ===');
    console.log('Token:', token ? 'Token exists' : 'No token found');
    console.log('User:', user);
    
    if (!token || !user) {
      console.error('No auth token or user data');
      setError('Please log in to continue');
      navigate('/login');
      return;
    }

    console.log('User role:', user.role);
    console.log('User ID:', user.id);
  }, [token, user, navigate]);

  // Initialize company data when component mounts
  useEffect(() => {
    console.log('=== Debug Component Mount ===');
    console.log('Token:', token);
    console.log('User:', user);
    console.log('Company ID from auth:', companyId);
    
    const initializeCompanyData = async () => {
      try {
        if (!user) {
          console.error('No user data available');
          setError('Please log in to continue');
          navigate('/login');
          return;
        }

        console.log('User role:', user.role);
        console.log('User ID:', user.id);
        console.log('Company ID from auth:', companyId);

        // Set company ID based on user role
        if (user.role === 'company') {
          console.log('Setting company data for company user');
          
          // Set the company data
          const companyData = {
            _id: companyId,
            name: user.companyName || 'Your Company'
          };
          console.log('Setting company data:', companyData);
          setSelectedCompany(companyData);
          setFormData(prev => ({ ...prev, companyId: companyId }));

          // Load products for this company
          await loadProducts();
        } else {
          // For non-company users, fetch companies
          console.log('Fetching companies for non-company user');
          await fetchCompanies();
        }
      } catch (err) {
        console.error('Error initializing company data:', err);
        setError('Failed to initialize company data');
      }
    };

    initializeCompanyData();
  }, [user, token, companyId, navigate]);

  // Function to fetch companies
  const fetchCompanies = async () => {
    try {
      console.log('=== Debug Fetch Companies ===');
      console.log('Fetching companies...');
      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token found');
      
      const response = await fetch('http://localhost:5000/api/companies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched companies data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Companies data is not an array:', data);
        setError('Invalid companies data received');
        return;
      }
      
      if (data.length === 0) {
        console.log('No companies found');
        setError('No companies available');
      } else {
        console.log('Setting companies:', data);
        setCompanies(data);
        
        // If user is a company user, set their company as selected
        if (user?.role === 'company') {
          console.log('User is a company user, setting their company');
          const userCompany = data.find(company => company._id === user.id);
          if (userCompany) {
            console.log('Found user company:', userCompany);
            setSelectedCompany(userCompany);
            setFormData(prev => ({ ...prev, companyId: userCompany._id }));
          }
        }
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies: ' + err.message);
    }
  };

  // Add a debug effect to monitor companies state
  useEffect(() => {
    console.log('=== Debug Companies State ===');
    console.log('Current companies:', companies);
    console.log('Selected company:', selectedCompany);
    console.log('User role:', user?.role);
  }, [companies, selectedCompany, user]);

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
    const selectedCompanyId = e.target.value;
    console.log('=== Debug Company Change ===');
    console.log('Selected company ID:', selectedCompanyId);
    
    const company = companies.find(c => c._id === selectedCompanyId);
    console.log('Found company:', company);
    
    if (!company) {
      console.error('Company not found for ID:', selectedCompanyId);
      setError('Invalid company selection');
      return;
    }

    // Set the selected company and update form data
    setSelectedCompany(company);
    setFormData(prev => {
      const newFormData = {
        ...prev,
        companyId: company._id
      };
      console.log('Updated form data with company ID:', newFormData);
      return newFormData;
    });
  };

  // Add debug effect to monitor form data
  useEffect(() => {
    console.log('=== Debug Form Data State ===');
    console.log('Current form data:', formData);
    console.log('Company ID in form data:', formData.companyId);
    console.log('Auth company ID:', companyId);
    console.log('User role:', user?.role);
  }, [formData, companyId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== Debug Form Submission ===');
    console.log('Current user:', user);
    console.log('Current form data:', formData);
    
    try {
      if (!user) {
        throw new Error('Please log in to continue');
      }

      // Validate form data
      if (!formData.name || !formData.description || !formData.category || 
          !formData.price || !formData.costPrice || !formData.sku) {
        throw new Error('Please fill in all required fields');
      }

      // Create product data
      const productData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        sku: formData.sku.trim(),
        unit: formData.unit || 'pcs',
        status: formData.status || 'Active',
        tagName: formData.tagName ? formData.tagName.trim() : ''
      };

      console.log('Final product data to be sent:', productData);

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
      } else {
        console.log('Calling createProduct with data:', productData);
        const response = await createProduct(productData);
        console.log('Product creation response:', response);
      }

      // Reset form and state
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
        tagName: ''
      });
      
      await loadProducts();
    } catch (err) {
      console.error('=== Error Details ===');
      console.error('Error type:', err.constructor.name);
      console.error('Error message:', err.message);
      console.error('Full error:', err);
      setError(err.message || 'Failed to save product');
    }
  };

  const handleAddProductClick = () => {
    console.log('=== Debug Add Product Click ===');
    console.log('Current user:', user);
    
    // Initialize form with empty data
    const newFormData = {
      name: '',
      description: '',
      price: '',
      costPrice: '',
      category: '',
      brand: '',
      sku: '',
      unit: 'pcs',
      status: 'Active',
      tagName: ''
    };
    
    console.log('Initializing form with data:', newFormData);
    setFormData(newFormData);
    setShowAddForm(!showAddForm);
    setEditingProduct(null);
  };

  // Update form when showAddForm changes
  useEffect(() => {
    if (showAddForm) {
      console.log('=== Debug Form Opening ===');
      console.log('Current user:', user);
      console.log('Selected company:', selectedCompany);
      console.log('Company ID from auth:', companyId);
      
      // Get company ID based on user role
      let formCompanyId;
      if (user?.role === 'company') {
        if (!companyId) {
          console.error('Company ID not found in auth context');
          setError('Company ID not found');
          setShowAddForm(false);
          return;
        }
        formCompanyId = companyId;
        console.log('Using company ID from auth for form:', formCompanyId);
      } else {
        formCompanyId = selectedCompany?._id;
        console.log('Using selected company ID for form:', formCompanyId);
      }

      if (!formCompanyId) {
        console.error('No company ID available');
        setError('Please select a company before adding a product');
        setShowAddForm(false);
        return;
      }
    }
  }, [showAddForm, user, selectedCompany, companyId]);

  // Update the form when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      console.log('=== Debug Edit Product ===');
      console.log('Editing product:', editingProduct);
      console.log('Selected company:', selectedCompany);
      
      const editFormData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        category: editingProduct.category,
        brand: editingProduct.brand,
        sku: editingProduct.sku,
        unit: editingProduct.unit,
        status: editingProduct.status,
        tagName: editingProduct.tagName || '',
        companyId: editingProduct.companyId
      };
      console.log('Setting form data for edit:', editFormData);
      setFormData(editFormData);
    }
  }, [editingProduct, selectedCompany]);

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

  // Add effect to update form data when company changes
  useEffect(() => {
    if (selectedCompany) {
      console.log('=== Debug Company Change ===');
      console.log('Selected company changed:', selectedCompany);
      
      const companyId = selectedCompany._id.toString();
      console.log('Setting company ID in form:', companyId);
      
      setFormData(prev => {
        const newFormData = {
          ...prev,
          companyId: companyId
        };
        console.log('Updated form data with company ID:', newFormData);
        return newFormData;
      });
    }
  }, [selectedCompany]);

  // Add effect to validate form data before submission
  useEffect(() => {
    if (formData) {
      console.log('=== Debug Form Data ===');
      console.log('Current form data:', formData);
      console.log('Company ID in form data:', formData.companyId);
      
      if (!formData.companyId) {
        console.warn('Company ID is missing from form data');
      }
    }
  }, [formData]);

  // Add effect to validate user and company data
  useEffect(() => {
    console.log('=== Debug User and Company ===');
    console.log('Current user:', user);
    console.log('User role:', user?.role);
    console.log('User ID:', user?.id);
    console.log('Selected company:', selectedCompany);
    console.log('Selected company ID:', selectedCompany?._id);
  }, [user, selectedCompany]);

  // Add effect to update form data when user changes
  useEffect(() => {
    if (user?.role === 'company') {
      console.log('=== Debug User Change ===');
      console.log('Company user detected, setting company ID:', user.id);
      
      setFormData(prev => {
        const newFormData = {
          ...prev,
          companyId: user.id.toString()
        };
        console.log('Updated form data with company ID:', newFormData);
        return newFormData;
      });
    }
  }, [user]);

  // Add effect to update form data when companyId changes
  useEffect(() => {
    console.log('=== Debug Company ID Effect ===');
    console.log('Company ID from auth:', companyId);
    console.log('User role:', user?.role);
    
    if (user?.role === 'company' && companyId) {
      console.log('Setting company ID in form data:', companyId);
      setFormData(prev => ({
        ...prev,
        companyId: companyId.toString()
      }));
    }
  }, [companyId, user]);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
        <h2 className="text-2xl font-bold">Company Products</h2>
          {user?.role === 'company' ? (
            <p className="text-gray-600 mt-1">Your Company Products</p>
          ) : (
            <p className="text-gray-600 mt-1">
              {selectedCompany ? `Company: ${selectedCompany.name}` : 'Select a company to view products'}
            </p>
          )}
        </div>
        <button
          onClick={handleAddProductClick}
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

      {/* Company selection dropdown - always show for non-company users */}
      {user?.role !== 'company' && !showAddForm && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Company *
            {!selectedCompany && (
              <span className="text-red-600 ml-1">(Required)</span>
            )}
          </label>
          <select
            value={selectedCompany?.name || ''}
            onChange={handleCompanyChange}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              !selectedCompany ? 'border-red-300' : ''
            }`}
            required
          >
            <option value="">Select a company</option>
            {companies && companies.length > 0 ? (
              companies.map((company) => (
                <option key={company._id} value={company.name}>
                  {company.name}
                </option>
              ))
            ) : (
              <option value="" disabled>No companies available</option>
            )}
          </select>
          {!selectedCompany && (
            <p className="mt-1 text-sm text-red-600">Please select a company to continue</p>
          )}
          {companies.length === 0 && !error && (
            <p className="mt-1 text-sm text-yellow-600">Loading companies...</p>
          )}
        </div>
      )}

      {showAddForm && !selectedCompany && user?.role !== 'company' && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Please select a company before adding a product
        </div>
      )}

      {showAddForm && selectedCompany && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>

          {/* Company Selection Dropdown - Always show at the top */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company *
              {!formData.companyId && (
                <span className="text-red-600 ml-1">(Required)</span>
              )}
            </label>
            <select
              value={formData.companyId || ''}
              onChange={handleCompanyChange}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                !formData.companyId ? 'border-red-300' : ''
              }`}
              required
              disabled={user?.role === 'company'}
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
            {!formData.companyId && (
              <p className="mt-1 text-sm text-red-600">Please select a company to continue</p>
            )}
          </div>

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