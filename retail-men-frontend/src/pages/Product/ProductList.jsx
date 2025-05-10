// src/pages/Product/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { fetchCompanyProducts } from '../../api/product';
import useAuth from '../../hooks/useAuth';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { token, user } = useAuth(); // assuming user object has companyId

  useEffect(() => {
    const getProducts = async () => {
      try {
        if (!user || !user.companyId) {
          console.warn('Company ID is missing in user object');
          return;
        }
        const data = await fetchCompanyProducts(user.companyId, token);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    if (token && user) {
      getProducts();
    }
  }, [token, user]);

  return (
    <div>
      <h2>Product List</h2>
      {products.length === 0 ? (
        <p>No products available for your company.</p>
      ) : (
        <ul>
          {products.map((prod) => (
            <li key={prod._id || prod.id}>
              {prod.name} - ${prod.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
