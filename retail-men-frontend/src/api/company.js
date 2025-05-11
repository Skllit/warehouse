// src/api/company.js

const COMPANY_URL = 'http://localhost:5001/api/company';

export const fetchCompanies = async (token) => {
  const response = await fetch(`${COMPANY_URL}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status} - ${response.statusText}`);
  }
  return response.json();
};

export const createCompany = async (companyData, token) => {
  console.log('Creating company with data:', companyData);

  // Normalize company name to prevent case-sensitive duplicates
  const normalizedName = companyData.name.trim();

  // Generate a unique identifier using timestamp and random string
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const response = await fetch(`${COMPANY_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: normalizedName,
        location: companyData.location,
        contactPerson: companyData.contactPerson,
        contactEmail: companyData.contactEmail.toLowerCase(),
        contactPhone: companyData.contactPhone,
        address: companyData.address,
        status: 'active',
        registrationNumber: uniqueId,
        code: normalizedName.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + uniqueId.substr(0, 6)
      })
    });

    const responseData = await response.json();
    console.log('Company creation response:', responseData);

    if (!response.ok) {
      console.log('Response not OK. Status:', response.status);
      console.log('Response data:', responseData);
      
      // Check if we have a detailed error message
      const errorMessage = responseData.details || responseData.message || `Failed to create company: ${response.statusText}`;
      console.log('Error message to be thrown:', errorMessage);
      
      throw new Error(errorMessage);
    }

    console.log('Company created successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Company creation error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response
    });
    throw error;
  }
};