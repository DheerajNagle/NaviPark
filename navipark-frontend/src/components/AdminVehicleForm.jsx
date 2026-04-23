import { useState, useEffect } from 'react';
import { vehiclesAPI } from '../services/api';
import { Car, User, MapPin, Plus, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const AdminVehicleForm = ({ onVehicleAdded }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    ownerName: '',
    slotNumber: ''
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = await vehiclesAPI.createVehicle(formData);

      setMessage('Vehicle added successfully!');
      setMessageType('success');
      setFormData({ vehicleNumber: '', ownerName: '', slotNumber: '' });
      fetchVehicles(); // Refresh the vehicle list
      if (onVehicleAdded) onVehicleAdded();
    } catch (error) {
      setMessage(error.message || 'Failed to add vehicle');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const data = await vehiclesAPI.getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await vehiclesAPI.deleteVehicle(id);
      setMessage('Vehicle removed successfully!');
      setMessageType('success');
      fetchVehicles();
    } catch (error) {
      setMessage('Failed to remove vehicle. Please try again.');
      setMessageType('error');
    }
  };

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="space-y-6">
      {/* Add Vehicle Form */}
      <section className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Car size={20} className="text-primary-light dark:text-primary-dark" />
          Add New Vehicle
        </h3>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            messageType === 'success' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span className="text-sm">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Car size={16} />
              Vehicle Number
            </label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleInputChange}
              placeholder="e.g., ABC123"
              className="input-field"
              required
            />
            <p className="text-xs text-slate-500 mt-1">3-10 alphanumeric characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <User size={16} />
              Owner Name
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              placeholder="e.g., John Smith"
              className="input-field"
              required
            />
            <p className="text-xs text-slate-500 mt-1">2-50 letters and spaces only</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin size={16} />
              Slot Number
            </label>
            <input
              type="text"
              name="slotNumber"
              value={formData.slotNumber}
              onChange={handleInputChange}
              placeholder="e.g., A12 or B2-C05"
              className="input-field"
              required
            />
            <p className="text-xs text-slate-500 mt-1">1-10 alphanumeric characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 w-full"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Adding Vehicle...
              </>
            ) : (
              <>
                <Plus size={18} className="mr-2" />
                Add Vehicle
              </>
            )}
          </button>
        </form>
      </section>

      {/* Vehicle List */}
      <section className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Car size={20} className="text-primary-light dark:text-primary-dark" />
            Vehicle List ({vehicles.length})
          </h3>
          <button
            onClick={fetchVehicles}
            className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 px-3 py-1.5 text-sm"
          >
            <RefreshCw size={16} className="mr-1" />
            Refresh
          </button>
        </div>

        {vehicles.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No vehicles added yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-2 font-medium">Vehicle #</th>
                  <th className="text-left py-2 px-2 font-medium">Owner</th>
                  <th className="text-left py-2 px-2 font-medium">Slot</th>
                  <th className="text-left py-2 px-2 font-medium">Source</th>
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
    </div>
  );
};

export default AdminVehicleForm;
