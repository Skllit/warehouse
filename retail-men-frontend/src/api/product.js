// src/api/product.js
const PRODUCT_URL = 'http://localhost:5003/api/products';

/**
 * Fetch all products
 * @returns Array of product objects
 */
export const fetchProducts = async (token) => {
  const res = await fetch(`${PRODUCT_URL}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Fetch products by company ID
 * @param companyId The ID of the company
 * @returns Array of product objects
 */
export const fetchCompanyProducts = async (companyId, token) => {
  const res = await fetch(`${PRODUCT_URL}/company/${companyId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Fetch products by category
 * @param categoryId The ID of the category
 * @returns Array of product objects
 */
export const fetchProductsByCategory = async (categoryId, token) => {
  const res = await fetch(`${PRODUCT_URL}?categoryId=${categoryId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Fetch a single product by ID
 * @param productId
 * @returns { data: { …product fields… } }
 */
export const fetchProductById = async (productId, token) => {
  const res = await fetch(`${PRODUCT_URL}/${productId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Create a new product
 * @param productData Object containing product details
 * @returns { data: { …product fields… } }
 */
export const createProduct = async (productData, token) => {
  const res = await fetch(`${PRODUCT_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.categoryId,
      sku: productData.sku,
      stock: productData.stock,
      unit: productData.unit,
      minStockLevel: productData.minStockLevel,
      status: productData.status || 'active'
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }
  return res.json();
};

/**
 * Update an existing product
 * @param productId ID of the product to update
 * @param productData Object containing updated product details
 * @returns { data: { …product fields… } }
 */
export const updateProduct = async (productId, productData, token) => {
  const res = await fetch(`${PRODUCT_URL}/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.categoryId,
      sku: productData.sku,
      stock: productData.stock,
      unit: productData.unit,
      minStockLevel: productData.minStockLevel,
      status: productData.status
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }
  return res.json();
};

/**
 * Delete a product
 * @param productId ID of the product to delete
 * @returns { success: true }
 */
export const deleteProduct = async (productId, token) => {
  const res = await fetch(`${PRODUCT_URL}/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }
  return res.json();
};
