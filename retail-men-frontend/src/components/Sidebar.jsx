// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';
import useAuth from '../hooks/useAuth';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: isActive(path) ? '#1a73e8' : '#5f6368',
    backgroundColor: isActive(path) ? '#e8f0fe' : 'transparent',
    textDecoration: 'none',
    borderRadius: '0 20px 20px 0',
    margin: '4px 0',
    transition: 'all 0.2s ease',
  });

  const getIconStyle = (path) => ({
    marginRight: '12px',
    color: isActive(path) ? '#1a73e8' : '#5f6368',
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{
      width: '256px',
      backgroundColor: '#1a237e',
      color: 'white',
      position: 'fixed',
      height: '100vh',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '0 20px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>RetailMen</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {user?.role === ROLES.ADMIN && (
          <>
            <NavLink to="/user-management" style={({ isActive }) => ({
              display: 'block',
              padding: '12px 20px',
              color: 'white',
              textDecoration: 'none',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            })}>
              User Management
            </NavLink>
            <NavLink to="/role-management" style={({ isActive }) => ({
              display: 'block',
              padding: '12px 20px',
              color: 'white',
              textDecoration: 'none',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            })}>
              Role Management
            </NavLink>
            <NavLink to="/warehouse-management" style={({ isActive }) => ({
              display: 'block',
              padding: '12px 20px',
              color: 'white',
              textDecoration: 'none',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            })}>
              Warehouse Management
            </NavLink>
            <NavLink to="/company-onboarding" style={({ isActive }) => ({
              display: 'block',
              padding: '12px 20px',
              color: 'white',
              textDecoration: 'none',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            })}>
              Company Onboarding
            </NavLink>
          </>
        )}

        {user?.role === ROLES.COMPANY && (
          <>
            <NavLink to="/company-profile" style={({ isActive }) => ({
              display: 'block',
              padding: '12px 20px',
              color: 'white',
              textDecoration: 'none',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            })}>
              Company Profile
            </NavLink>
            <NavLink to="/product-management" style={({ isActive }) => ({
              display: 'block',
              padding: '12px 20px',
              color: 'white',
              textDecoration: 'none',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            })}>
              Product Management
            </NavLink>
            <NavLink to="/company-list" style={({ isActive }) => ({
              display: 'block',
              padding: '12px 20px',
              color: 'white',
              textDecoration: 'none',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            })}>
              Company List
            </NavLink>
          </>
        )}

        {user?.role === ROLES.WAREHOUSE_MANAGER && (
          <NavLink to="/warehouse-dashboard" style={({ isActive }) => ({
            display: 'block',
            padding: '12px 20px',
            color: 'white',
            textDecoration: 'none',
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
          })}>
            Warehouse Dashboard
          </NavLink>
        )}

        {user?.role === ROLES.BRANCH_MANAGER && (
          <NavLink to="/branch-dashboard" style={({ isActive }) => ({
            display: 'block',
            padding: '12px 20px',
            color: 'white',
            textDecoration: 'none',
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
          })}>
            Branch Dashboard
          </NavLink>
        )}

        {/* Common Links */}
        <NavLink to="/dashboard" style={({ isActive }) => ({
          display: 'block',
          padding: '12px 20px',
          color: 'white',
          textDecoration: 'none',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
        })}>
          Dashboard
        </NavLink>
        <NavLink to="/product-list" style={({ isActive }) => ({
          display: 'block',
          padding: '12px 20px',
          color: 'white',
          textDecoration: 'none',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
        })}>
          Products
        </NavLink>
        <NavLink to="/stock-overview" style={({ isActive }) => ({
          display: 'block',
          padding: '12px 20px',
          color: 'white',
          textDecoration: 'none',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
        })}>
          Stock Overview
        </NavLink>
        <NavLink to="/order-list" style={({ isActive }) => ({
          display: 'block',
          padding: '12px 20px',
          color: 'white',
          textDecoration: 'none',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
        })}>
          Orders
        </NavLink>
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            border: '1px solid white',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
