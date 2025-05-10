import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/auth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('company');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await authApi.registerUser({ 
        email, 
        password, 
        username,
        role 
      });
      navigate('/login');
    } catch (error) {
      setError(error.message || 'Registration failed');
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:
          <input type="text" value={username}
            onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>Email:
          <input type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>Password:
          <input type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>Confirm Password:
          <input type="password" value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} required />
        </label>
        <label>Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="company">Company</option>
            <option value="warehouse-manager">Warehouse Manager</option>
            <option value="branch-manager">Branch Manager</option>
            <option value="sales">Sales</option>
          </select>
        </label>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a>.</p>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Register;