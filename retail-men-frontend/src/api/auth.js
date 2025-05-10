// src/api/auth.js
const AUTH_URL = 'http://localhost:5000/api/auth';

/**
 * Register a new user
 * @param {Object} userData - User data including email and name
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Created user data
 */
const registerUser = async (userData, token) => {
  try {
    console.log('Registering user with data:', userData);
    
    const response = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password, // Add confirmPassword field
        role: userData.role
      })
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
    throw new Error(error.message || 'Failed to register user');
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
 * Get all users
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of users
 */
const getUsers = async (token) => {
  try {
    const response = await fetch(`${AUTH_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
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
 * Get available roles
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
 * Update user role
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
 * Delete a user
 * @param {string} userId - User ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Deletion response
 */
const deleteUser = async (userId, token) => {
  try {
    const response = await fetch(`${AUTH_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
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

const createRole = async (roleName, token) => {
  const response = await fetch(`${AUTH_URL}/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ role: roleName })
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

const updateRole = async (oldRole, newRole, token) => {
  const response = await fetch(`${AUTH_URL}/roles/${oldRole}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ newRole })
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

const authApi = {
  registerUser,
  loginUser,
  getUsers,
  fetchRoles,
  updateUserRole,
  deleteUser,
  createRole,
  updateRole
};

export default authApi;