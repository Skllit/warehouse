// src/api/stock.js
const STOCK_URL = 'http://localhost:5003/api/stock';

/**
 * Fetch all stock entries
 * @returns Array of stock objects
 */
export const fetchAllStock = async (token) => {
  const res = await fetch(`${STOCK_URL}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Fetch stock by warehouse
 * @param warehouseId The ID of the warehouse
 * @returns Array of stock objects
 */
export const fetchStockByWarehouse = async (warehouseId, token) => {
  const res = await fetch(`${STOCK_URL}/warehouse/${warehouseId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Fetch stock by branch
 * @param branchId The ID of the branch
 * @returns Array of stock objects
 */
export const fetchStockByBranch = async (branchId, token) => {
  const res = await fetch(`${STOCK_URL}/branch/${branchId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Update stock quantity
 * @param stockId ID of the stock entry
 * @param quantity New quantity
 * @returns Updated stock object
 */
export const updateStockQuantity = async (stockId, quantity, token) => {
  const res = await fetch(`${STOCK_URL}/${stockId}/quantity`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ quantity })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }
  return res.json();
};

/**
 * Add stock movement (in/out)
 * @param stockId ID of the stock entry
 * @param movementData Object containing movement details
 * @returns Updated stock object
 */
export const addStockMovement = async (stockId, movementData, token) => {
  const res = await fetch(`${STOCK_URL}/${stockId}/movement`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      type: movementData.type, // 'in' or 'out'
      quantity: movementData.quantity,
      reason: movementData.reason,
      reference: movementData.reference,
      notes: movementData.notes
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }
  return res.json();
};

/**
 * Get stock movement history
 * @param stockId ID of the stock entry
 * @returns Array of movement objects
 */
export const getStockMovementHistory = async (stockId, token) => {
  const res = await fetch(`${STOCK_URL}/${stockId}/movements`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Transfer stock between locations
 * @param transferData Object containing transfer details
 * @returns Transfer result object
 */
export const transferStock = async (transferData, token) => {
  const res = await fetch(`${STOCK_URL}/transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      productId: transferData.productId,
      fromLocation: transferData.fromLocation,
      toLocation: transferData.toLocation,
      quantity: transferData.quantity,
      notes: transferData.notes
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }
  return res.json();
};

/**
 * Get low stock alerts
 * @returns Array of stock objects with quantities below minimum level
 */
export const getLowStockAlerts = async (token) => {
  const res = await fetch(`${STOCK_URL}/alerts/low-stock`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};