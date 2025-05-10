// src/api/branch.js
const BRANCH_URL = 'http://localhost:5004';

const fetchBranches = async (token) => {
  const response = await fetch(`${BRANCH_URL}/api/branches`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

const fetchBranchesByWarehouse = async (warehouseId, token) => {
  const res = await fetch(`${BRANCH_URL}/api/branches/warehouse/${warehouseId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // array of branches for that warehouse
};

const branchApi = {
  fetchBranches,
  fetchBranchesByWarehouse
};

export default branchApi;