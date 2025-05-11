// src/api/auth.js
const AUTH_URL = 'http://localhost:5000/api/auth';

/**
 * Register a new user
 * @param {Object} userData - User data including email, password, confirmPassword, username and role
 * @returns {Promise<Object>} Created user data
 */
const registerUser = async (userData) => {
  try {
    console.log('Registering user with data:', userData);
    
    const response = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    // If response is not JSON, handle it appropriately
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Invalid response format: ${await response.text()}`);
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user account');
    }

    console.log('User registration successful:', data);
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login a user
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} Login response data
 */
const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Get all users (admin only)
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of users
 */
const getUsers = async (token) => {
  try {
    const response = await fetch(`${AUTH_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get user details (admin only)
 * @param {string} userId - User ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} User details
 */
const getUserDetails = async (userId, token) => {
  try {
    const response = await fetch(`${AUTH_URL}/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user details');
    }
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

/**
 * Get available roles (admin only)
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of roles
 */
const fetchRoles = async (token) => {
  try {
    const response = await fetch(`${AUTH_URL}/roles`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch roles');
    }
    return data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

/**
 * Update user role (admin only)
 * @param {string} userId - User ID
 * @param {string} role - New role
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Updated user data
 */
const updateUserRole = async (userId, role, token) => {
  try {
    const response = await fetch(`${AUTH_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user role');
    }
    return data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

/**
 * Delete user (admin only)
 * @param {string} userId - User ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Deletion response
 */
const deleteUser = async (userId, token) => {
  try {
    const response = await fetch(`${AUTH_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete user');
    }
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Create new role (admin only)
 * @param {string} roleName - New role name
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Created role data
 */
const createRole = async (roleName, token) => {
  try {
    const response = await fetch(`${AUTH_URL}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role: roleName })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create role');
    }
    return data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

/**
 * Update role (admin only)
 * @param {string} oldRole - Current role name
 * @param {string} newRole - New role name
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Updated role data
 */
const updateRole = async (oldRole, newRole, token) => {
  try {
    const response = await fetch(`${AUTH_URL}/roles/${oldRole}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ newRole })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update role');
    }
    return data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

const authApi = {
  registerUser,
  loginUser,
  getUsers,
  getUserDetails,
  fetchRoles,
  updateUserRole,
  deleteUser,
  createRole,
  updateRole
};

export default authApi;