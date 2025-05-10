import React, { useState, useEffect, useCallback } from 'react';
import { 
  fetchAllStock, 
  updateStockQuantity, 
  addStockMovement, 
  getStockMovementHistory,
  transferStock,
  getLowStockAlerts 
} from '../../api/stock';
import { fetchWarehouses } from '../../api/warehouse';
import { fetchProducts } from '../../api/product';
import useAuth from '../../hooks/useAuth';
import { 
  FiEdit2, 
  FiPlus, 
  FiX, 
  FiCheck, 
  FiAlertCircle, 
  FiPackage, 
  FiBox, 
  FiSearch,
  FiArrowUp,
  FiArrowDown,
  FiRefreshCw,
  FiFilter
} from 'react-icons/fi';

const StockManagement = () => {
  const { token } = useAuth();
  const [stock, setStock] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [movementHistory, setMovementHistory] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [movementFormData, setMovementFormData] = useState({
    type: 'in',
    quantity: '',
    reason: '',
    reference: '',
    notes: ''
  });
  const [transferFormData, setTransferFormData] = useState({
    toLocation: '',
    quantity: '',
    notes: ''
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [stockData, warehousesData, productsData, alertsData] = await Promise.all([
        fetchAllStock(token),
        fetchWarehouses(token),
        fetchProducts(token),
        getLowStockAlerts(token)
      ]);
      setStock(Array.isArray(stockData) ? stockData : []);
      setWarehouses(warehousesData);
      setProducts(productsData);
      setLowStockAlerts(alertsData);
    } catch (error) {
      setError('Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleWarehouseChange = (e) => {
    setSelectedWarehouse(e.target.value);
  };

  const handleStockMovement = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await addStockMovement(selectedStock._id, movementFormData, token);
      setSuccess('Stock movement recorded successfully!');
      setShowMovementForm(false);
      setMovementFormData({
        type: 'in',
        quantity: '',
        reason: '',
        reference: '',
        notes: ''
      });
      await loadData();
    } catch (error) {
      setError('Failed to record stock movement');
      console.error('Error recording stock movement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockTransfer = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await transferStock({
        productId: selectedStock.product._id,
        fromLocation: selectedStock.location,
        toLocation: transferFormData.toLocation,
        quantity: transferFormData.quantity,
        notes: transferFormData.notes
      }, token);
      setSuccess('Stock transferred successfully!');
      setShowTransferForm(false);
      setTransferFormData({
        toLocation: '',
        quantity: '',
        notes: ''
      });
      await loadData();
    } catch (error) {
      setError('Failed to transfer stock');
      console.error('Error transferring stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMovementHistory = async (stockId) => {
    try {
      const history = await getStockMovementHistory(stockId, token);
      setMovementHistory(history);
    } catch (error) {
      console.error('Error loading movement history:', error);
    }
  };

  const filteredStock = stock.filter(item => {
    const matchesSearch = item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product?.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = !selectedWarehouse || item.location === selectedWarehouse;
    return matchesSearch && matchesWarehouse;
  });

  if (loading && !stock.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Stock Management</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setShowMovementForm(!showMovementForm);
              setShowTransferForm(false);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {showMovementForm ? (
              <>
                <FiX className="mr-2" /> Cancel
              </>
            ) : (
              <>
                <FiPlus className="mr-2" /> Add Stock Movement
              </>
            )}
          </button>
          <button
            onClick={() => {
              setShowTransferForm(!showTransferForm);
              setShowMovementForm(false);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            {showTransferForm ? (
              <>
                <FiX className="mr-2" /> Cancel
              </>
            ) : (
              <>
                <FiRefreshCw className="mr-2" /> Transfer Stock
              </>
            )}
          </button>
        </div>
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

      {lowStockAlerts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Low Stock Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockAlerts.map(alert => (
              <div key={alert._id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center">
                  <FiAlertCircle className="text-red-500 mr-2" />
                  <div>
                    <p className="font-medium text-red-800">{alert.product.name}</p>
                    <p className="text-sm text-red-600">
                      Current stock: {alert.quantity} {alert.unit} (Min: {alert.minStockLevel})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(showMovementForm || showTransferForm) && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {showMovementForm ? 'Add Stock Movement' : 'Transfer Stock'}
          </h3>
          {showMovementForm ? (
            <form onSubmit={handleStockMovement} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product</label>
                  <select
                    value={selectedStock?._id || ''}
                    onChange={(e) => setSelectedStock(stock.find(s => s._id === e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a product</option>
                    {stock.map(item => (
                      <option key={item._id} value={item._id}>
                        {item.product.name} ({item.product.sku})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Movement Type</label>
                  <select
                    value={movementFormData.type}
                    onChange={(e) => setMovementFormData({ ...movementFormData, type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="in">Stock In</option>
                    <option value="out">Stock Out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    value={movementFormData.quantity}
                    onChange={(e) => setMovementFormData({ ...movementFormData, quantity: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <input
                    type="text"
                    value={movementFormData.reason}
                    onChange={(e) => setMovementFormData({ ...movementFormData, reason: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reference</label>
                  <input
                    type="text"
                    value={movementFormData.reference}
                    onChange={(e) => setMovementFormData({ ...movementFormData, reference: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={movementFormData.notes}
                    onChange={(e) => setMovementFormData({ ...movementFormData, notes: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="2"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowMovementForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Record Movement'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleStockTransfer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product</label>
                  <select
                    value={selectedStock?._id || ''}
                    onChange={(e) => setSelectedStock(stock.find(s => s._id === e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a product</option>
                    {stock.map(item => (
                      <option key={item._id} value={item._id}>
                        {item.product.name} ({item.product.sku})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination</label>
                  <select
                    value={transferFormData.toLocation}
                    onChange={(e) => setTransferFormData({ ...transferFormData, toLocation: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select destination</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse._id} value={warehouse._id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    value={transferFormData.quantity}
                    onChange={(e) => setTransferFormData({ ...transferFormData, quantity: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={transferFormData.notes}
                    onChange={(e) => setTransferFormData({ ...transferFormData, notes: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="2"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTransferForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Transferring...' : 'Transfer Stock'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h3 className="text-lg font-semibold text-gray-800">Stock List</h3>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={selectedWarehouse}
                onChange={handleWarehouseChange}
                className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Warehouses</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStock.map(item => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FiPackage className="mr-1" /> {item.product.sku}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {warehouses.find(w => w._id === item.location)?.name || 'Unknown Location'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FiBox className="mr-1" /> {item.quantity} {item.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Min: {item.minStockLevel} {item.unit}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.quantity <= item.minStockLevel
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.quantity <= item.minStockLevel ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => {
                          setSelectedStock(item);
                          setShowMovementForm(true);
                          setShowTransferForm(false);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
                      >
                        <FiArrowUp className="w-4 h-4 mr-1" />
                        <span className="text-sm">Movement</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStock(item);
                          setShowTransferForm(true);
                          setShowMovementForm(false);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors duration-200"
                      >
                        <FiRefreshCw className="w-4 h-4 mr-1" />
                        <span className="text-sm">Transfer</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStock.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FiBox className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">No stock found</p>
                      <p className="text-sm">Try adjusting your search or add new stock</p>
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

export default StockManagement; 