import React, { useState, useEffect, useCallback } from 'react';
import { dummySalesData } from './dummyData';
import useAuth from '../../hooks/useAuth';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const SalesAnalytics = () => {
  const { token } = useAuth();
  const [timeRange, setTimeRange] = useState('week');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [analytics, setAnalytics] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Use dummy data for now
      setAnalytics(dummySalesData);
      
      // Get sales data for selected branch
      let branchData = [];
      if (selectedBranch === 'all') {
        // Combine data from all branches
        branchData = dummySalesData.branchWiseSales.reduce((acc, branch) => {
          branch.dailySales.forEach(sale => {
            const existingDay = acc.find(day => day.date === sale.date);
            if (existingDay) {
              existingDay.amount += sale.amount;
            } else {
              acc.push({ ...sale });
            }
          });
          return acc;
        }, []);
      } else {
        const branch = dummySalesData.branchWiseSales.find(b => b.branchId === selectedBranch);
        branchData = branch ? branch.dailySales : [];
      }
      
      // Sort the data by date
      branchData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setSalesData(branchData);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [selectedBranch]);

  useEffect(() => {
    loadData();
  }, [loadData, timeRange]);

  const getBranchWiseProductData = useCallback(() => {
    if (selectedBranch === 'all') {
      // Combine product data from all branches
      const productMap = new Map();
      dummySalesData.branchWiseSales.forEach(branch => {
        branch.productWiseSales.forEach(product => {
          if (!productMap.has(product.productId)) {
            productMap.set(product.productId, {
              productId: product.productId,
              productName: product.productName,
              totalQuantity: 0,
              totalRevenue: 0
            });
          }
          const existingProduct = productMap.get(product.productId);
          existingProduct.totalQuantity += product.totalQuantity;
          existingProduct.totalRevenue += product.totalRevenue;
        });
      });
      return Array.from(productMap.values());
    } else {
      const branch = dummySalesData.branchWiseSales.find(b => b.branchId === selectedBranch);
      return branch ? branch.productWiseSales : [];
    }
  }, [selectedBranch]);

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const productData = getBranchWiseProductData();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sales Analytics</h2>
        <div className="flex gap-4">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Branches</option>
            {dummySalesData.branchWiseSales.map(branch => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
              </option>
            ))}
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 365 Days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${analytics?.summary?.totalSales?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-green-600">
            {analytics?.summary?.totalOrders?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-purple-600">
            ${analytics?.summary?.averageOrderValue?.toFixed(2) || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  name="Sales" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Products</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="productName" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'totalRevenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                    name === 'totalRevenue' ? 'Revenue' : 'Quantity'
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="totalRevenue" 
                  fill="#10B981" 
                  name="Revenue"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="totalQuantity" 
                  fill="#6366F1" 
                  name="Quantity"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productData.map((product) => (
                <tr key={product.productId}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.totalRevenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.totalQuantity.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${(product.totalRevenue / product.totalQuantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics; 