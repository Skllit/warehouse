// src/api/branch.js
const BRANCH_URL = 'http://localhost:5004/api';

/**
 * Fetch all branches
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of branches
 */
const fetchBranches = async (token) => {
  try {
    const response = await fetch(`${BRANCH_URL}/branches`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch branches');
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

/**
 * Fetch branches by warehouse ID
 * @param {string} warehouseId - Warehouse ID
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of branches for the warehouse
 */
const fetchBranchesByWarehouse = async (warehouseId, token) => {
  try {
    const response = await fetch(`${BRANCH_URL}/branches/warehouse/${warehouseId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch branches for warehouse');
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching branches by warehouse:', error);
    throw error;
  }
};

/**
 * Fetch branch with warehouse information
 * @param {string} branchId - Branch ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Branch with warehouse info
 */
const fetchBranchWithWarehouse = async (branchId, token) => {
  try {
    const response = await fetch(`${BRANCH_URL}/branch-with-warehouse/${branchId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch branch with warehouse info');
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching branch with warehouse:', error);
    throw error;
  }
};

/**
 * Create a new branch
 * @param {Object} branchData - Branch data including name, location, warehouseId, and managerId
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Created branch data
 */
const createBranch = async (branchData, token) => {
  try {
    const response = await fetch(`${BRANCH_URL}/branches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(branchData)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create branch');
    }
    return data.data;
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
};

/**
 * Fetch branch stock
 * @param {string} branchId - Branch ID
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} Branch stock data
 */
const fetchBranchStock = async (branchId, token) => {
  try {
    const response = await fetch(`${BRANCH_URL}/branches/${branchId}/stock`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch branch stock');
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching branch stock:', error);
    throw error;
  }
};

/**
 * Adjust branch stock
 * @param {string} branchId - Branch ID
 * @param {string} productId - Product ID
 * @param {number} quantityChange - Quantity change (positive for addition, negative for reduction)
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Updated stock data
 */
const adjustBranchStock = async (branchId, productId, quantityChange, token) => {
  try {
    const response = await fetch(`${BRANCH_URL}/branches/${branchId}/stock-adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantityChange })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to adjust branch stock');
    }
    return data.data;
  } catch (error) {
    console.error('Error adjusting branch stock:', error);
    throw error;
  }
};

/**
 * Create a restock request
 * @param {string} branchId - Branch ID
 * @param {string} productId - Product ID
 * @param {number} quantity - Requested quantity
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Created restock request data
 */
const createRestockRequest = async (branchId, productId, quantity, token) => {
  try {
    const response = await fetch(`${BRANCH_URL}/branches/${branchId}/restock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create restock request');
    }
    return data.data;
  } catch (error) {
    console.error('Error creating restock request:', error);
    throw error;
  }
};

/**
 * Create a stock request
 * @param {Object} requestData - Request data including warehouseId, productId, and quantity
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Created stock request data
 */
const createStockRequest = async (requestData, token) => {
  try {
    const response = await fetch(`${BRANCH_URL}/stock-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create stock request');
    }
    return data.data;
  } catch (error) {
    console.error('Error creating stock request:', error);
    throw error;
  }
};

const branchApi = {
  fetchBranches,
  fetchBranchesByWarehouse,
  fetchBranchWithWarehouse,
  createBranch,
  fetchBranchStock,
  adjustBranchStock,
  createRestockRequest,
  createStockRequest
};

export default branchApi;