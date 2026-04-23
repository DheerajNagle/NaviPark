import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Car, Info } from 'lucide-react';

const Dashboard = () => {
  const { vehicleDetails, setVehicleDetails } = useContext(AppContext);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Info size={20} className="text-sky-500 dark:text-sky-400" />
          Facility Overview
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="card !p-4 text-center">
            <span className="block text-xs uppercase text-slate-500 mb-1">Total</span>
            <span className="text-2xl font-bold">120</span>
          </div>
          <div className="card !p-4 text-center border-b-4 border-b-green-500">
            <span className="block text-xs uppercase text-slate-500 mb-1">Free</span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">42</span>
          </div>
          <div className="card !p-4 text-center border-b-4 border-b-red-500">
            <span className="block text-xs uppercase text-slate-500 mb-1">Full</span>
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">78</span>
          </div>
        </div>
      </section>

      {/* Vehicle Details */}
      <section className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Car size={20} className="text-sky-500 dark:text-sky-400" />
          My Vehicle Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">License Plate</label>
            <input 
              type="text" 
              placeholder="e.g. ABC-1234" 
              className="input-field"
              value={vehicleDetails.plate}
              onChange={(e) => setVehicleDetails({...vehicleDetails, plate: e.target.value.toUpperCase()})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">Notes (Color, Make)</label>
            <input 
              type="text" 
              placeholder="e.g. Red Honda Civic" 
              className="input-field"
              value={vehicleDetails.notes}
              onChange={(e) => setVehicleDetails({...vehicleDetails, notes: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <span className="text-xl">+</span>
            </div>
            <span className="text-sm text-slate-500">Add Car Photo (Optional)</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
