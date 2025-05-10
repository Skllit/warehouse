import React, { useState, useEffect, useCallback } from 'react';
import { fetchWarehouses, fetchWarehouseWithBranches, createWarehouse, updateWarehouse, deleteWarehouse } from '../../api/warehouse';
import { fetchCompanies } from '../../api/company';
import authApi from '../../api/auth';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../constants/roles';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiAlertCircle, FiMapPin, FiUser, FiHome } from 'react-icons/fi';

const WarehouseManagement = () => {
  const { token } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    companyId: '',
    managerId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [warehousesData, companiesData, usersData] = await Promise.all([
        fetchWarehouses(token),
        fetchCompanies(token),
        authApi.getUsers(token)
      ]);
      setWarehouses(warehousesData);
      setCompanies(companiesData);
      const managers = usersData.filter(user => user.role === ROLES.WAREHOUSE_MANAGER);
      setManagers(managers);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelect = async (id) => {
    setSelected(id);
    try {
      const data = await fetchWarehouseWithBranches(id, token);
      setBranches(data.branches || []);
    } catch (err) {
      setBranches([]);
    }
  };

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      location: warehouse.location,
      companyId: warehouse.company?._id || '',
      managerId: warehouse.manager?._id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (warehouseId) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        setError('');
        await deleteWarehouse(warehouseId, token);
        setSuccess('Warehouse deleted successfully!');
        loadData();
      } catch (err) {
        setError(err.message || 'Failed to delete warehouse');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingWarehouse) {
        await updateWarehouse(editingWarehouse._id, formData, token);
        setSuccess('Warehouse updated successfully!');
      } else {
        await createWarehouse(formData, token);
        setSuccess('Warehouse created successfully!');
      }
      setShowForm(false);
      setEditingWarehouse(null);
      setFormData({ name: '', location: '', companyId: '', managerId: '' });
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to save warehouse');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !warehouses.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Warehouse Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingWarehouse(null);
            setFormData({ name: '', location: '', companyId: '', managerId: '' });
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          {showForm ? (
            <>
              <FiX className="mr-2" /> Cancel
            </>
          ) : (
            <>
              <FiPlus className="mr-2" /> Add Warehouse
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <FiAlertCircle className="mr-2 text-xl" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center p-4 mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
          <FiCheck className="mr-2 text-xl" />
          <p>{success}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transform transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">
            {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <select
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Warehouse Manager</label>
                <select
                  value={formData.managerId}
                  onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                >
                  <option value="">Select a manager</option>
                  {managers.map(manager => (
                    <option key={manager._id} value={manager._id}>
                      {manager.username} ({manager.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Warehouse Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (editingWarehouse ? 'Update Warehouse' : 'Add Warehouse')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Warehouse List</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Total Warehouses: {warehouses.length}</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {warehouses.map(warehouse => (
                <tr key={warehouse._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{warehouse.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FiMapPin className="mr-1" /> {warehouse.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiHome className="mr-1" /> {warehouse.company?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUser className="mr-1" /> {warehouse.manager?.username || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => handleEdit(warehouse)}
                        className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
                      >
                        <FiEdit2 className="w-4 h-4 mr-1" />
                        <span className="text-sm">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(warehouse._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
                      >
                        <FiTrash2 className="w-4 h-4 mr-1" />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {warehouses.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FiAlertCircle className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">No warehouses found</p>
                      <p className="text-sm">Add a new warehouse to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WarehouseManagement;
