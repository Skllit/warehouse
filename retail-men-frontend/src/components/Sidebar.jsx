// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROLES } from '../constants/roles';
import useAuth from '../hooks/useAuth';

const Sidebar = () => {
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

  return (
    <div style={{
      width: '256px',
      height: '100vh',
      backgroundColor: '#fff',
      borderRight: '1px solid #e0e0e0',
      padding: '20px 0',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      <div style={{ padding: '0 20px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#1a73e8' }}>Retail Men</h2>
      </div>

      <nav>
        <Link to="/dashboard" style={getLinkStyle('/dashboard')}>
          <span style={getIconStyle('/dashboard')}>📊</span>
          Dashboard
        </Link>

        {user?.role === 'admin' && (
          <>
            <Link to="/user-management" style={getLinkStyle('/user-management')}>
              <span style={getIconStyle('/user-management')}>👥</span>
              User Management
            </Link>
            <Link to="/company-management" style={getLinkStyle('/company-management')}>
              <span style={getIconStyle('/company-management')}>🏢</span>
              Company Management
            </Link>
            <Link to="/warehouse-management" style={getLinkStyle('/warehouse-management')}>
              <span style={getIconStyle('/warehouse-management')}>🏭</span>
              Warehouse Management
            </Link>
            <Link to="/admin/stock-management" style={getLinkStyle('/admin/stock-management')}>
              <span style={getIconStyle('/admin/stock-management')}>📦</span>
              Stock Management
            </Link>
            <Link to="/product-management" style={getLinkStyle('/product-management')}>
              <span style={getIconStyle('/product-management')}>🏷️</span>
              Product Management
            </Link>
          </>
        )}

        {(user?.role === 'warehouse-manager' || user?.role === 'branch-manager') && (
          <>
            <Link to="/products" style={getLinkStyle('/products')}>
              <span style={getIconStyle('/products')}>👕</span>
              Products
            </Link>
            <Link to="/stock" style={getLinkStyle('/stock')}>
              <span style={getIconStyle('/stock')}>📦</span>
              Stock
            </Link>
          </>
        )}

        {user?.role === 'sales' && (
          <>
            <Link to="/orders" style={getLinkStyle('/orders')}>
              <span style={getIconStyle('/orders')}>🛒</span>
              Orders
            </Link>
            <Link to="/sales-analytics" style={getLinkStyle('/sales-analytics')}>
              <span style={getIconStyle('/sales-analytics')}>📈</span>
              Sales Analytics
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
