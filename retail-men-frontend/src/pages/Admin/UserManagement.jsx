import React, { useState, useEffect } from 'react';
import authApi from '../../api/auth';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../constants/roles';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    loadUsers();
  }, [token]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await authApi.getUsers(token);
      console.log('Fetched users:', data); // Debug log
      setUsers(Array.isArray(data) ? data : (data.users || []));
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setError('');
      await authApi.updateUserRole(userId, newRole, token);
      await loadUsers(); // Reload the users list
    } catch (err) {
      console.error('Error updating role:', err);
      setError(err.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setError('');
        await authApi.deleteUser(userId, token);
        await loadUsers(); // Reload the users list
      } catch (err) {
        console.error('Error deleting user:', err);
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>User Management</h2>

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

      <div style={{ 
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <table style={{ 
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Username</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Role</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{user.username}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{user.email}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    style={{
                      padding: '6px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    {Object.values(ROLES).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={{
                      padding: '6px 12px',
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

export default UserManagement;