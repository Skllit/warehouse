// src/pages/RoleManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import authApi from '../../api/auth';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../constants/roles';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const fetchRoles = useCallback(async () => {
    try {
      const roles = await authApi.fetchRoles(token);
      setRoles(roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError('Failed to fetch roles');
    }
  }, [token]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRole.trim()) return;

    try {
      await authApi.createRole(newRole, token);
      setNewRole('');
      fetchRoles();
    } catch (error) {
      console.error('Error creating role:', error);
      setError('Failed to create role');
    }
  };

  const handleUpdateRole = async (oldRole, newRole) => {
    try {
      await authApi.updateRole(oldRole, newRole, token);
      setEditingRole(null);
      fetchRoles();
    } catch (error) {
      console.error('Error updating role:', error);
      setError('Failed to update role');
    }
  };

  return (
    <div>
      <h2>Role Management</h2>
      
      {/* Create New Role Form */}
      <form onSubmit={handleCreateRole} style={{ marginBottom: '2rem' }}>
        <h3>Create New Role</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Enter new role name"
            style={{ padding: '0.5rem' }}
          />
          <button type="submit">Create Role</button>
        </div>
      </form>

      {/* List of Existing Roles */}
      <div>
        <h3>Existing Roles</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {roles.map((role, index) => (
            <li key={index} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ccc' }}>
              {editingRole === role ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="text"
                    value={editingRole}
                    onChange={(e) => setEditingRole(e.target.value)}
                    style={{ padding: '0.5rem' }}
                  />
                  <button onClick={() => handleUpdateRole(role, editingRole)}>Save</button>
                  <button onClick={() => setEditingRole(null)}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{role}</span>
                  <button onClick={() => setEditingRole(role)}>Edit</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoleManagement;