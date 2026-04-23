// API Configuration using environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

// Authentication API
export const authAPI = {
  login: async (identifier, method, bypassRole = null) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, method, bypassRole }),
    });
  },
};

// Parking API
export const parkingAPI = {
  getSlots: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const endpoint = `/parking/slots${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiRequest(endpoint);
  },
  
  locateVehicle: async (id) => {
    return await apiRequest(`/parking/locate/${id}`);
  },
  
  updateSlotStatus: async (slotId, status, userId = null, vehicleId = null) => {
    return await apiRequest(`/parking/slots/${slotId}/override`, {
      method: 'POST',
      body: JSON.stringify({ status, user_id: userId, vehicle_id: vehicleId }),
    });
  },
  
  getSessions: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const endpoint = `/parking/sessions${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiRequest(endpoint);
  },
};

// Vehicles API - PRODUCTION READY
export const vehiclesAPI = {
  getVehicles: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const endpoint = `/vehicles${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiRequest(endpoint);
  },
  
  createVehicle: async (vehicleData) => {
    // Uses Vite proxy to route to backend on port 5000
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

// Lost & Found API
export const lostFoundAPI = {
  getReports: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const endpoint = `/reports${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiRequest(endpoint);
  },
  
  createReport: async (reportData) => {
    return await apiRequest('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },
  
  resolveReport: async (reportId, resolvedBy = null) => {
    return await apiRequest(`/reports/${reportId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ resolved_by: resolvedBy }),
    });
  },
};

// System API
export const systemAPI = {
  getHealth: async () => {
    return await apiRequest('/system/health');
  },
};

export default {
  authAPI,
  parkingAPI,
  vehiclesAPI,
  lostFoundAPI,
  systemAPI,
};
