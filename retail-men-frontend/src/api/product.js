// src/api/product.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL || 'http://localhost:5002/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  console.log('Token being sent:', token); // Debug log
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const createProduct = async (productData) => {
  try {
    console.log('Raw product data received:', productData); // Debug log
    console.log('CompanyId in product data:', productData.companyId); // Debug log

    // Ensure companyId is included in the request
    if (!productData.companyId) {
      console.error('CompanyId is missing from product data'); // Debug log
      throw new Error('Company ID is required');
    }

    // Create a new object with all required fields
    const requestData = {
      ...productData,
      companyId: productData.companyId.toString() // Ensure companyId is a string
    };

    console.log('Creating product with data:', requestData); // Debug log
    const response = await axios.post(`${API_URL}/products`, requestData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Full error object:', error); // Log the full error object
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      throw new Error(error.response.data?.message || 'Failed to create product');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      throw new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
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
