import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchAllStock,
  fetchStockByWarehouse,
  updateStockQuantity,
  addStockMovement,
  getStockMovementHistory,
  transferStock,
  getLowStockAlerts
} from '../../api/stock';
import { fetchWarehouses } from '../../api/warehouse';
import { FiPackage, FiPlus, FiMinus, FiArrowRight, FiAlertCircle, FiRefreshCw, FiFilter, FiSearch } from 'react-icons/fi';

const StockManagement = () => {
  const { token, user } = useAuth();
  const [stock, setStock] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [movementHistory, setMovementHistory] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form states
  const [movementForm, setMovementForm] = useState({
    type: 'in',
    quantity: '',
    reason: '',
    reference: '',
    notes: ''
  });

  const [transferForm, setTransferForm] = useState({
    toLocation: '',
    quantity: '',
    notes: ''
  });

  const loadStock = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = selectedWarehouse
        ? await fetchStockByWarehouse(selectedWarehouse, token)
        : await fetchAllStock(token);
      setStock(data);
      
      // Load low stock alerts
      const alerts = await getLowStockAlerts(token);
      setLowStockAlerts(alerts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, selectedWarehouse]);

  const loadWarehouses = useCallback(async () => {
    try {
      const data = await fetchWarehouses(token);
      setWarehouses(data);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  useEffect(() => {
    loadWarehouses();
    loadStock();
  }, [loadWarehouses, loadStock]);

  const handleWarehouseChange = (e) => {
    setSelectedWarehouse(e.target.value);
  };

  const handleMovementSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await addStockMovement(selectedStock.id, movementForm, token);
      setSuccess('Stock movement recorded successfully');
      setShowMovementForm(false);
      loadStock();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await transferStock({
        productId: selectedStock.productId,
        fromLocation: selectedStock.locationId,
        toLocation: transferForm.toLocation,
        quantity: transferForm.quantity,
        notes: transferForm.notes
      }, token);
      setSuccess('Stock transferred successfully');
      setShowTransferForm(false);
      loadStock();
    } catch (err) {
      setError(err.message);
    }
  };

  const loadMovementHistory = async (stockId) => {
    try {
      const history = await getStockMovementHistory(stockId, token);
      setMovementHistory(history);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredStock = stock.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'low' && item.quantity <= item.minStockLevel) ||
                         (filterStatus === 'out' && item.quantity === 0);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600 mt-1">Manage and track inventory across all locations</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <select
            value={selectedWarehouse}
            onChange={handleWarehouseChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Warehouses</option>
            {warehouses.map(warehouse => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts Section */}
      {lowStockAlerts.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Low Stock Alerts
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  {lowStockAlerts.map(alert => (
                    <li key={alert.id}>
                      {alert.productName} is running low ({alert.quantity} remaining)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStock.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiPackage className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {item.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.locationName}</div>
                    <div className="text-sm text-gray-500">{item.locationType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {item.quantity} {item.unit}
                    </div>
                    <div className="text-sm text-gray-500">
                      Min: {item.minStockLevel} {item.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.quantity <= item.minStockLevel
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.quantity === 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.quantity <= item.minStockLevel
                        ? 'Low Stock'
                        : item.quantity === 0
                        ? 'Out of Stock'
                        : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelectedStock(item);
                        setShowMovementForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiPlus className="inline-block mr-1" />
                      Add Stock
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStock(item);
                        setShowMovementForm(true);
                        setMovementForm(prev => ({ ...prev, type: 'out' }));
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiMinus className="inline-block mr-1" />
                      Remove Stock
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStock(item);
                        setShowTransferForm(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      <FiArrowRight className="inline-block mr-1" />
                      Transfer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Form Modal */}
      {showMovementForm && selectedStock && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">
                {movementForm.type === 'in' ? 'Add Stock' : 'Remove Stock'}
              </h3>
              <form onSubmit={handleMovementSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={movementForm.quantity}
                    onChange={(e) => setMovementForm(prev => ({ ...prev, quantity: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reason
                  </label>
                  <input
                    type="text"
                    value={movementForm.reason}
                    onChange={(e) => setMovementForm(prev => ({ ...prev, reason: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reference
                  </label>
                  <input
                    type="text"
                    value={movementForm.reference}
                    onChange={(e) => setMovementForm(prev => ({ ...prev, reference: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={movementForm.notes}
                    onChange={(e) => setMovementForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowMovementForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    {movementForm.type === 'in' ? 'Add Stock' : 'Remove Stock'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Form Modal */}
      {showTransferForm && selectedStock && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">
                Transfer Stock
              </h3>
              <form onSubmit={handleTransferSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    To Location
                  </label>
                  <select
                    value={transferForm.toLocation}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, toLocation: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Location</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={transferForm.quantity}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, quantity: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={transferForm.notes}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowTransferForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg">
          <div className="flex items-center">
            <FiCheck className="h-5 w-5 mr-2" />
            <p>{success}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement; 