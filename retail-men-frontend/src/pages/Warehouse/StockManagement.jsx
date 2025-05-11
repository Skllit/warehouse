import React, { useState, useEffect } from 'react';
import { fetchWarehouseStock, requestStock, updateStock } from '../../api/warehouse';
import { fetchCompanies } from '../../api/company';
import useAuth from '../../hooks/useAuth';

const StockManagement = () => {
  const { token, user } = useAuth();
  const [stock, setStock] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    companyId: '',
    productId: '',
    quantity: '',
    expectedDeliveryDate: ''
  });

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stockData, companiesData] = await Promise.all([
        fetchWarehouseStock(user.warehouseId, token),
        fetchCompanies(token)
      ]);
      setStock(Array.isArray(stockData) ? stockData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestStock = async (e) => {
    e.preventDefault();
    try {
      await requestStock({
        ...requestData,
        warehouseId: user.warehouseId
      }, token);
      setShowRequestForm(false);
      setRequestData({
        companyId: '',
        productId: '',
        quantity: '',
        expectedDeliveryDate: ''
      });
      loadData();
    } catch (err) {
      console.error('Error requesting stock:', err);
      setError('Failed to request stock');
    }
  };

  const handleUpdateStock = async (productId, newQuantity) => {
    try {
      await updateStock(user.warehouseId, productId, newQuantity, token);
      loadData();
    } catch (err) {
      console.error('Error updating stock:', err);
      setError('Failed to update stock');
    }
  };

  if (loading) {
    return <div className="loading">Loading stock data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Warehouse Stock Management</h2>
        <button
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showRequestForm ? 'Cancel' : 'Request Stock'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showRequestForm && (
        <form onSubmit={handleRequestStock} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Request Stock from Company</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <select
                value={requestData.companyId}
                onChange={(e) => setRequestData({ ...requestData, companyId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select
                value={requestData.productId}
                onChange={(e) => setRequestData({ ...requestData, productId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select a product</option>
                {/* Products will be populated based on selected company */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                value={requestData.quantity}
                onChange={(e) => setRequestData({ ...requestData, quantity: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
              <input
                type="date"
                value={requestData.expectedDeliveryDate}
                onChange={(e) => setRequestData({ ...requestData, expectedDeliveryDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Request Stock
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stock.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.product.company.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.product.minimumStock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.quantity <= item.product.minimumStock
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.quantity <= item.product.minimumStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      const newQuantity = prompt('Enter new quantity:', item.quantity);
                      if (newQuantity !== null) {
                        handleUpdateStock(item.product._id, parseInt(newQuantity));
                      }
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Update Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManagement; 