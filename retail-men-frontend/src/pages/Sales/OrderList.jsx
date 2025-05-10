// src/pages/Sales/OrderList.jsx
import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../../api/sales';
import useAuth from '../../hooks/useAuth';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetchOrders(token);
        // Ensure we have an array of orders
        const ordersData = Array.isArray(response) ? response : 
                         response.data ? response.data : 
                         response.orders ? response.orders : [];
        setOrders(ordersData);
      } catch (err) {
        console.error('Error loading orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  if (loading) {
    return (
      <div style={{ 
        padding: '20px',
        textAlign: 'center',
        color: '#666'
      }}>
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px',
        backgroundColor: '#ffebee',
        color: '#c62828',
        borderRadius: '4px',
        margin: '20px'
      }}>
        {error}
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div style={{ 
        padding: '20px',
        textAlign: 'center',
        color: '#666'
      }}>
        No orders found
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Orders</h2>
      
      <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <table style={{ 
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Order ID</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Customer</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Total</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id || order.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  {order._id || order.id}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  {new Date(order.createdAt || order.date).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  {order.customerName || order.customer?.name || 'N/A'}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  ${order.total || order.amount || 0}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: order.status === 'completed' ? '#e8f5e9' : '#fff3e0',
                    color: order.status === 'completed' ? '#2e7d32' : '#ef6c00'
                  }}>
                    {order.status || 'pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
