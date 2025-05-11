// src/App.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserManagement from './pages/Admin/UserManagement';
import RoleManagement from './pages/Admin/RoleManagement';
import CompanyList from './pages/Company/CompanyList';
import CompanyOnboarding from './pages/Admin/CompanyOnboarding';
import WarehouseDashboard from './pages/Warehouse/WarehouseDashboard';
import BranchDashboard from './pages/Branch/BranchDashboard';
import ProductList from './pages/Product/ProductList';
import StockOverview from './pages/Stock/StockOverview';
import OrderList from './pages/Sales/OrderList';
import WarehouseManagement from './pages/Admin/WarehouseManagement';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './constants/roles';
import Dashboard from './pages/Dashboard';
import SalesAnalytics from './pages/Sales/SalesAnalytics';
import CompanyProfile from './pages/Company/CompanyProfile';
import ProductManagement from './pages/Product/ProductManagement';

function App() {
  const { token, user } = useContext(AuthContext);

  const getDefaultRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case ROLES.ADMIN:
        return '/user-management';
      case ROLES.COMPANY:
        return '/company-profile';
      case ROLES.WAREHOUSE_MANAGER:
        return '/warehouse-dashboard';
      case ROLES.BRANCH_MANAGER:
        return '/branch-dashboard';
      case ROLES.SALES:
        return '/order-list';
      default:
        return '/login';
    }
  };

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {token && <Sidebar user={user} />}
        <div style={{ 
          flex: 1,
          marginLeft: token ? '256px' : '0',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh'
        }}>
          {token && <Navbar />}
          <div style={{ 
            marginTop: token ? '64px' : '0',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Routes>
              <Route path="/" element={<Navigate to={getDefaultRoute()} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin Routes */}
              <Route path="/user-management" element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/role-management" element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <RoleManagement />
                </ProtectedRoute>
              } />
              <Route path="/warehouse-management" element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <WarehouseManagement />
                </ProtectedRoute>
              } />
              <Route path="/company-onboarding" element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <CompanyOnboarding />
                </ProtectedRoute>
              } />

              {/* Company Routes */}
              <Route path="/company-profile" element={
                <ProtectedRoute roles={[ROLES.COMPANY]}>
                  <CompanyProfile />
                </ProtectedRoute>
              } />
              <Route path="/company-list" element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.COMPANY]}>
                  <CompanyList />
                </ProtectedRoute>
              } />
              <Route path="/product-management" element={
                <ProtectedRoute roles={[ROLES.COMPANY]}>
                  <ProductManagement />
                </ProtectedRoute>
              } />

              {/* Warehouse Manager Routes */}
              <Route path="/warehouse-dashboard" element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.COMPANY, ROLES.WAREHOUSE_MANAGER]}>
                  <WarehouseDashboard />
                </ProtectedRoute>
              } />

              {/* Branch Manager Routes */}
              <Route path="/branch-dashboard" element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.BRANCH_MANAGER]}>
                  <BranchDashboard />
                </ProtectedRoute>
              } />

              {/* Common Routes */}
              <Route path="/product-list" element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.COMPANY, ROLES.SALES]}>
                  <ProductList />
                </ProtectedRoute>
              } />
              <Route path="/stock-overview" element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.COMPANY, ROLES.WAREHOUSE_MANAGER, ROLES.BRANCH_MANAGER]}>
                  <StockOverview />
                </ProtectedRoute>
              } />
              <Route path="/order-list" element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.BRANCH_MANAGER, ROLES.SALES]}>
                  <OrderList />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.COMPANY, ROLES.WAREHOUSE_MANAGER, ROLES.BRANCH_MANAGER, ROLES.SALES]}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/sales/analytics" element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SALES]}>
                  <SalesAnalytics />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to={getDefaultRoute()} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
