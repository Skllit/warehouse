// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token in AuthContext:', decoded); // Debug log
        setUser({
          id: decoded.id,
          role: decoded.role,
          ...decoded
        });
      } catch (error) {
        console.error('Invalid token', error);
        setUser(null);
      }
    }
  }, [token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;