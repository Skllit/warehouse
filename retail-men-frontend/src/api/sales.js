// src/api/sales.js
import { SALES_URL } from '../config';

const fetchOrders = async (token) => {
  try {
    const response = await fetch(`${SALES_URL}/api/sales`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

const fetchOrdersByBranch = async (token, branchId) => {
  try {
    const response = await fetch(`${SALES_URL}/api/sales/branch/${branchId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching branch orders:', error);
    throw error;
  }
};

const fetchOrdersByWarehouse = async (token, warehouseId) => {
  try {
    const response = await fetch(`${SALES_URL}/api/sales/warehouse/${warehouseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching warehouse orders:', error);
    throw error;
  }
};

const fetchProductSales = async (productId, token) => {
  const response = await fetch(`${SALES_URL}/api/sales/product/${productId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
};

const fetchSalesAnalytics = async (token, filters = {}) => {
  try {
    const { timeRange, branchId, warehouseId, startDate, endDate, category } = filters;
    
    // Build query string
    const params = new URLSearchParams();
    if (timeRange) params.append('timeRange', timeRange);
    if (branchId) params.append('branchId', branchId);
    if (warehouseId) params.append('warehouseId', warehouseId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (category) params.append('category', category);

    const queryString = params.toString();
    const url = `${SALES_URL}/api/sales/analytics${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching sales analytics from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('Sales analytics response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    throw error;
  }
};

const fetchSalesData = async (token, startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate instanceof Date) {
      params.append('startDate', startDate.toISOString());
    }
    if (endDate instanceof Date) {
      params.append('endDate', endDate.toISOString());
    }

    const response = await fetch(`${SALES_URL}/api/sales/data?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sales data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};

const fetchSalesSummary = async (token) => {
  try {
    const response = await fetch(`${SALES_URL}/api/sales/summary`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sales summary');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    throw error;
  }
};

export {
  fetchOrders,
  fetchOrdersByBranch,
  fetchOrdersByWarehouse,
  fetchProductSales,
  fetchSalesAnalytics,
  fetchSalesData,
  fetchSalesSummary
};
