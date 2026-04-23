// API Configuration - FIXED to use direct backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic API request function with enhanced error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`API Request: ${config.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error (${endpoint}):`, response.status, errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`API Success (${endpoint}):`, data);
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Vehicles API - CORRECTED
export const vehiclesAPI = {
  getVehicles: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const endpoint = `/vehicles${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiRequest(endpoint);
  },
  
  createVehicle: async (vehicleData) => {
    // FIXED: Direct call to backend on port 5000
    return await apiRequest('/vehicles/add', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },
  
  updateVehicle: async (vehicleId, vehicleData) => {
    return await apiRequest(`/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  },
  
  deleteVehicle: async (vehicleId) => {
    return await apiRequest(`/vehicles/${vehicleId}`, {
      method: 'DELETE',
    });
  },
};

export default vehiclesAPI;
