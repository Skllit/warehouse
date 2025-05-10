import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

// Dummy data for dashboard
const dummyDashboardData = {
  salesData: {
    totalSales: 105000,
    totalOrders: 365,
    averageOrderValue: 287.67,
    topProducts: [
      { name: 'Running Shoes', sales: 29500, quantity: 580 },
      { name: 'Casual Shirts', sales: 38000, quantity: 950 },
      { name: 'Jeans', sales: 22500, quantity: 750 },
      { name: 'Formal Shoes', sales: 9900, quantity: 330 },
      { name: 'T-Shirts', sales: 5100, quantity: 1250 }
    ],
    branchPerformance: [
      { name: 'Main Branch', sales: 45000, orders: 150 },
      { name: 'North Branch', sales: 32000, orders: 120 },
      { name: 'South Branch', sales: 28000, orders: 95 }
    ]
  },
  salesSummary: {
    dailySales: [
      { date: '2024-04-01', amount: 3500 },
      { date: '2024-04-02', amount: 4200 },
      { date: '2024-04-03', amount: 3800 },
      { date: '2024-04-04', amount: 4500 },
      { date: '2024-04-05', amount: 4100 },
      { date: '2024-04-06', amount: 3900 },
      { date: '2024-04-07', amount: 4300 }
    ],
    monthlyGrowth: 12.5,
    topPerformingBranch: 'Main Branch',
    mostSoldProduct: 'Casual Shirts'
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Use dummy data
        setDashboardData(dummyDashboardData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        padding: '20px',
        textAlign: 'center',
        color: '#666'
      }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px',
        color: '#c62828',
        backgroundColor: '#ffebee',
        borderRadius: '4px'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard</h2>
      <p>Welcome back, {user?.name || 'User'}!</p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Total Sales</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a73e8' }}>
            ${dashboardData.salesData.totalSales.toLocaleString()}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Total Orders</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a73e8' }}>
            {dashboardData.salesData.totalOrders}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Average Order Value</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a73e8' }}>
            ${dashboardData.salesData.averageOrderValue.toFixed(2)}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Monthly Growth</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a73e8' }}>
            {dashboardData.salesSummary.monthlyGrowth}%
          </p>
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
          <h3>Top Products</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Sales</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.salesData.topProducts.map((product, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{product.name}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>${product.sales.toLocaleString()}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Branch Performance</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Branch</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Sales</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Orders</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.salesData.branchPerformance.map((branch, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{branch.name}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>${branch.sales.toLocaleString()}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{branch.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 