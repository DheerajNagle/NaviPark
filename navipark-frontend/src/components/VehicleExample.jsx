import { useState, useEffect } from 'react';
import { vehiclesAPI } from '../services/api';

const VehicleExample = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const data = await vehiclesAPI.getVehicles();
        setVehicles(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleAddVehicle = async () => {
    try {
      const newVehicle = await vehiclesAPI.createVehicle({
        vehicleNumber: 'TEST123',
        ownerName: 'Test Owner',
        slotNumber: 'A1'
      });
      setVehicles([...vehicles, newVehicle]);
    } catch (err) {
      console.error('Failed to add vehicle:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading vehicles...</div>;
  }

  if (error) {
    return (
      <div>
        <h3>Error: {error}</h3>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Vehicle Management</h2>
      
      <button 
        onClick={handleAddVehicle}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Test Vehicle
      </button>

      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="border p-4 rounded">
            <h3 className="font-semibold">{vehicle.vehicleNumber || vehicle.license_plate}</h3>
            <p>Owner: {vehicle.ownerName || vehicle.user_name}</p>
            <p>Slot: {vehicle.slotNumber || 'N/A'}</p>
            <p>Source: {vehicle.source || 'regular'}</p>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && (
        <p>No vehicles found. Add one to test the API connection.</p>
      )}
    </div>
  );
};

export default VehicleExample;
