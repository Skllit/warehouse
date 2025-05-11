// src/api/warehouse.js
const WAREHOUSE_URL = 'http://localhost:5003/api/warehouses';

/**
 * Fetch all warehouses
 * @returns Array of warehouse objects
 */
export const fetchWarehouses = async (token) => {
  const res = await fetch(`${WAREHOUSE_URL}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Fetch warehouses by company ID
 * @param companyId The ID of the company
 * @returns Array of warehouse objects
 */
export const fetchWarehousesByCompany = async (companyId, token) => {
  const res = await fetch(`${WAREHOUSE_URL}?companyId=${companyId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Fetch a single warehouse by ID
 * @param warehouseId
 * @returns { data: { …warehouse fields… } }
 */
export const fetchWarehouseById = async (warehouseId, token) => {
  const res = await fetch(`${WAREHOUSE_URL}/${warehouseId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); 
  // shape: { data: { _id, name, location, … } }
};

/**
 * Fetch a warehouse along with its branches
 * @param warehouseId
 * @returns { warehouse: {…}, branches: [ … ] }
 */
export const fetchWarehouseWithBranches = async (warehouseId, token) => {
  const res = await fetch(`${WAREHOUSE_URL}/${warehouseId}/with-branches`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Fetch stock for a given warehouse
 * @param warehouseId
 * @returns { warehouseId, stock: [ … ] }
 */
export const fetchWarehouseStock = async (warehouseId, token) => {
  const res = await fetch(`${WAREHOUSE_URL}/${warehouseId}/stock`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Create a new warehouse
 * @param warehouseData Object containing warehouse details (name, location, companyId, managerId)
 * @returns { data: { …warehouse fields… } }
 */
export const createWarehouse = async (warehouseData, token) => {
  const res = await fetch(`${WAREHOUSE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: warehouseData.name,
      location: warehouseData.location,
      company: warehouseData.companyId,
      managerId: warehouseData.managerId
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }
  return res.json();
};
