import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { fetchSalesAnalytics, fetchOrdersByBranch, fetchOrdersByWarehouse } from '../../api/sales';
import useAuth from '../../hooks/useAuth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SalesDashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [branchData, setBranchData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [branchSales, warehouseSales] = await Promise.all([
          fetchOrdersByBranch(token),
          fetchOrdersByWarehouse(token)
        ]);

        setBranchData(branchSales);
        setWarehouseData(warehouseSales);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, timeRange]);

  const branchChartData = {
    labels: branchData.map(branch => branch.name),
    datasets: [
      {
        label: 'Sales by Branch',
        data: branchData.map(branch => branch.totalSales),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const warehouseChartData = {
    labels: warehouseData.map(warehouse => warehouse.name),
    datasets: [
      {
        label: 'Sales by Warehouse',
        data: warehouseData.map(warehouse => warehouse.totalSales),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      },
    ],
  };

  const branchDistributionData = {
    labels: branchData.map(branch => branch.name),
    datasets: [
      {
        data: branchData.map(branch => branch.totalSales),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales Amount ($)',
        },
      },
    },
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sales Dashboard</h2>

      {error && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Time Range:</label>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Sales by Branch</h3>
          <Bar data={branchChartData} options={chartOptions} />
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Sales by Warehouse</h3>
          <Bar data={warehouseChartData} options={chartOptions} />
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Branch Sales Distribution</h3>
          <Pie data={branchDistributionData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: 'Sales Distribution by Branch',
              },
            },
          }} />
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Top Performing Branches</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Branch</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Total Sales</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Orders</th>
              </tr>
            </thead>
            <tbody>
              {branchData
                .sort((a, b) => b.totalSales - a.totalSales)
                .slice(0, 5)
                .map(branch => (
                  <tr key={branch._id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{branch.name}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>${branch.totalSales}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{branch.totalOrders}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
