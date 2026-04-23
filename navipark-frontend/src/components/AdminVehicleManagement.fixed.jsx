import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldAlert, Car, RefreshCw } from 'lucide-react';
import { vehiclesAPI } from '../services/api';
import AdminVehicleForm from './AdminVehicleForm';

const AdminVehicleManagement = () => {
  const { userRole } = useContext(AppContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // FIXED: Use API service to fetch vehicles
      const data = await vehiclesAPI.getVehicles();
      setVehicles(data);
      
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Refresh vehicle list after adding a new vehicle
  const handleVehicleAdded = () => {
    fetchVehicles();
  };

  // Only allow access if user role === "admin"
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full dark:bg-red-900/30">
              <ShieldAlert size={48} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            You don't have permission to access this admin feature.
            This area is restricted to administrators only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card bg-blue-500/10 border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Car className="text-blue-600 dark:text-blue-400" size={24} />
            <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400">
              Admin Vehicle Management
            </h2>
          </div>
          <button
            onClick={fetchVehicles}
            disabled={loading}
            className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 px-3 py-1.5 text-sm"
          >
            <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Add and manage vehicles in the parking system. View and manage all registered vehicles.
        </p>
      </div>

      {/* Vehicle List Section */}
      <section className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Car size={20} className="text-primary-light dark:text-primary-dark" />
            Vehicle List ({vehicles.length})
          </h3>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-600 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <RefreshCw size={24} className="animate-spin text-blue-500" />
            <p className="text-sm text-slate-500 mt-2">Loading vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-8">
            <Car size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-500">No vehicles added yet</p>
            <p className="text-sm text-slate-400">
              Add your first vehicle to get started with vehicle management.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-2 font-medium">Vehicle #</th>
                  <th className="text-left py-2 px-2 font-medium">Owner</th>
                  <th className="text-left py-2 px-2 font-medium">Slot</th>
                  <th className="text-left py-2 px-2 font-medium">Source</th>
                  <th className="text-left py-2 px-2 font-medium">Added</th>
                  <th className="text-right py-2 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 px-2 font-mono text-xs">{vehicle.vehicleNumber || vehicle.license_plate}</td>
                    <td className="py-2 px-2">{vehicle.ownerName || vehicle.user_name || 'N/A'}</td>
                    <td className="py-2 px-2 font-mono text-xs">{vehicle.slotNumber || 'N/A'}</td>
                    <td className="py-2 px-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        vehicle.source === 'admin' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {vehicle.source || 'regular'}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-xs">
                      {new Date(vehicle.createdAt || vehicle.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-2 text-right">
                      {vehicle.source === 'admin' && (
                        <button
                          onClick={() => deleteVehicle(vehicle.id)}
                          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AdminVehicleForm onVehicleAdded={handleVehicleAdded} />
    </div>
  );
};

const deleteVehicle = async (id) => {
  try {
    // FIXED: Use API service to delete vehicle
    const response = await vehiclesAPI.deleteVehicle(id);
    
    if (response.success) {
      // Refresh the vehicle list
      const vehicles = await vehiclesAPI.getVehicles();
      setVehicles(vehicles);
    } else {
      setError('Failed to remove vehicle');
    }
  } catch (err) {
    console.error('Delete vehicle error:', err);
    setError('Failed to remove vehicle');
  }
};

export default AdminVehicleManagement;
