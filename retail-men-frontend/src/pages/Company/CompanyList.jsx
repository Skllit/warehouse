// src/pages/CompanyList.jsx
import React, { useState, useEffect } from 'react';
import { fetchCompanies } from '../../api/company';
import { fetchWarehousesByCompany } from '../../api/warehouse';
import useAuth from '../../hooks/useAuth';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [warehousesByCompany, setWarehousesByCompany] = useState({});
  const { token } = useAuth();

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const data = await fetchCompanies(token);
        setCompanies(Array.isArray(data) ? data : (data.companies || []));
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    getCompanies();
  }, [token]);

  const toggleCompany = async (companyId) => {
    if (expandedCompany === companyId) {
      setExpandedCompany(null);
      return;
    }

    setExpandedCompany(companyId);
    try {
      const warehouses = await fetchWarehousesByCompany(companyId, token);
      setWarehousesByCompany(prev => ({
        ...prev,
        [companyId]: Array.isArray(warehouses) ? warehouses : (warehouses.data || [])
      }));
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  return (
    <div>
      <h2>Company List</h2>
      <ul>
        {companies.map((company) => (
          <li key={company._id || company.id} style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => toggleCompany(company._id || company.id)}
              style={{
                fontWeight: 'bold',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0
              }}
            >
              {expandedCompany === (company._id || company.id) ? '▼' : '▶'} {company.name}
            </button>

            {expandedCompany === (company._id || company.id) && (
              <div style={{ marginLeft: '1.5rem' }}>
                <h3>Warehouses</h3>
                {warehousesByCompany[company._id || company.id]?.length > 0 ? (
                  <ul>
                    {warehousesByCompany[company._id || company.id].map(warehouse => (
                      <li key={warehouse._id || warehouse.id}>
                        {warehouse.name} — {warehouse.location}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p><em>No warehouses found</em></p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyList;