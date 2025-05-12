// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    console.log('=== Debug Auth Context ===');
    console.log('Token from storage:', token ? 'Token exists' : 'No token found');
    
    if (token) {
      try {
        // Use jwtDecode instead of manual decoding
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        
        // Set user data with all fields from token
        const userData = {
          id: decoded.id,
          role: decoded.role,
          email: decoded.email,
          companyName: decoded.companyName,
          ...decoded
        };
        
        console.log('Setting user data:', userData);
        setUser(userData);

        // Set company ID if user is a company
        if (userData.role === 'company') {
          console.log('Setting company ID from user ID:', userData.id);
          setCompanyId(userData.id);
          // Store company ID in localStorage for persistence
          localStorage.setItem('companyId', userData.id);
        } else {
          setCompanyId(null);
          localStorage.removeItem('companyId');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        console.error('Token that failed to decode:', token);
        setUser(null);
        setToken(null);
        setCompanyId(null);
        localStorage.removeItem('token');
        localStorage.removeItem('companyId');
      }
    } else {
      console.log('No token found, setting user and company ID to null');
      setUser(null);
      setCompanyId(null);
      localStorage.removeItem('companyId');
    }
  }, [token]);

  const login = (newToken) => {
    console.log('=== Debug Login ===');
    console.log('Setting new token');
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    console.log('=== Debug Logout ===');
    console.log('Clearing token, user data, and company ID');
    localStorage.removeItem('token');
    localStorage.removeItem('companyId');
    setToken(null);
    setUser(null);
    setCompanyId(null);
  };

  // Log user state changes
  useEffect(() => {
    console.log('=== Debug User State ===');
    console.log('Current user:', user);
    console.log('User role:', user?.role);
    console.log('User ID:', user?.id);
    console.log('Company ID:', companyId);
  }, [user, companyId]);

  return (
    <AuthContext.Provider value={{ token, user, companyId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;