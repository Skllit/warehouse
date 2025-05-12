// src/api/product.js
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const API_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL || 'http://localhost:5002/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  console.log('=== Debug Auth Header ===');
  console.log('Token being sent:', token ? 'Token exists' : 'No token found');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const createProduct = async (productData) => {
  try {
    console.log('=== Debug Product Creation ===');
    console.log('Raw product data received:', productData);
    
    // Get auth header and token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Decode token to get company ID
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);
    
    // Get company ID from token for company role users
    const companyId = decoded.role === 'company' ? decoded.id : productData.companyId;
    console.log('Using company ID:', companyId);

    if (!companyId) {
      console.error('Company ID not found in token or product data');
      throw new Error('Company ID is required');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Create a new object with all required fields
    const requestData = {
      name: productData.name.trim(),
      description: productData.description.trim(),
      category: productData.category.trim(),
      price: Number(productData.price),
      costPrice: Number(productData.costPrice),
      sku: productData.sku.trim(),
      unit: productData.unit || 'pcs',
      status: productData.status || 'Active',
      companyId: companyId.toString(), // Use company ID from token for company users
      tagName: productData.tagName ? productData.tagName.trim() : ''
    };

    console.log('Creating product with data:', requestData);
    console.log('Request URL:', `${API_URL}/products`);
    console.log('Request headers:', headers);
    console.log('Request data:', requestData);

    // Validate all required fields are present
    if (!requestData.name || !requestData.description || !requestData.category || 
        !requestData.price || !requestData.costPrice || !requestData.sku || !requestData.companyId) {
      console.error('Missing required fields:', {
        name: !requestData.name,
        description: !requestData.description,
        category: !requestData.category,
        price: !requestData.price,
        costPrice: !requestData.costPrice,
        sku: !requestData.sku,
        companyId: !requestData.companyId
      });
      throw new Error('All required fields must be filled');
    }

    // Make the API call
    const response = await axios.post(`${API_URL}/products`, requestData, headers);
    console.log('Product creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('=== Error Details ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response received from server. Please check if the product service is running.');
    } else {
      console.error('Error details:', error);
      throw new Error(error.message || 'Failed to create product');
    }
  }
};

export const getProductsByCompany = async (companyId) => {
  try {
    const response = await axios.get(`${API_URL}/products/company/${companyId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error.response) {
      throw new Error(error.response.data?.message || 'Failed to fetch products');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error(error.message || 'Failed to fetch products');
    }
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`${API_URL}/products/${productId}`, productData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.response) {
      throw new Error(error.response.data?.message || 'Failed to update product');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error(error.message || 'Failed to update product');
    }
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${productId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.response) {
      throw new Error(error.response.data?.message || 'Failed to delete product');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error(error.message || 'Failed to delete product');
    }
  }
};

export const updateProductStatus = async (productId, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/products/${productId}/status`,
      { status },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating product status:', error);
    if (error.response) {
      throw new Error(error.response.data?.message || 'Failed to update product status');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error(error.message || 'Failed to update product status');
    }
  }
};
