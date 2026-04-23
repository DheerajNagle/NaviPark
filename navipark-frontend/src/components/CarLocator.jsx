import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { parkingAPI } from '../services/api';
import { QrCode, Search, Navigation } from 'lucide-react';

const CarLocator = () => {
  const { carLocation, setCarLocation, setTimerActive, setSecondsElapsed } = useContext(AppContext);
  const [inputId, setInputId] = useState('');
  const [error, setError] = useState('');

  const handleLocate = async (e) => {
    e.preventDefault();
    const id = inputId.trim().toUpperCase();
    setError('');
    
    try {
      const slot = await parkingAPI.locateVehicle(id);
      setCarLocation({ 
        id: slot.id, 
        floor: slot.floor, 
        zone: slot.zone, 
        slot: slot.slot_number,
        instructions: slot.instructions || []
      });
      setSecondsElapsed(0);
      setTimerActive(true);
    } catch (error) {
      setError('Car ID not found. Try B2-A12, B1-C05, or a license plate number');
    }
  };

  if (carLocation) {
    return (
      <div className="card border-2 border-green-500/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-green-600 dark:text-green-400">Vehicle Located</h2>
          <button 
            onClick={() => { setCarLocation(null); setTimerActive(false); }}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white underline"
          >
            Clear
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <span className="block text-xs uppercase text-slate-500">Floor</span>
            <span className="text-xl font-bold">{carLocation.floor}</span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <span className="block text-xs uppercase text-slate-500">Zone</span>
            <span className="text-xl font-bold">{carLocation.zone}</span>
          </div>
          <div className="bg-sky-500/10 dark:bg-sky-400/10 p-3 rounded-lg text-center">
            <span className="block text-xs uppercase text-sky-500 dark:text-sky-400">Slot</span>
            <span className="text-xl font-bold text-sky-500 dark:text-sky-400">{carLocation.slot}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Navigation size={16} /> Walking Directions
          </h3>
          <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400 pl-6 list-disc marker:text-sky-500 dark:marker:text-sky-400">
            {carLocation.instructions.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Locate Your Car</h2>
      <form onSubmit={handleLocate} className="space-y-4">
        <div className="relative">
          <QrCode className="absolute left-3 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Enter Car ID (e.g. B2-A12)" 
            className="input-field pl-10"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm animate-pulse">{error}</p>}
        <button type="submit" className="btn btn-primary w-full">
          <Search size={18} /> Find Vehicle
        </button>
      </form>
    </div>
  );
};

export default CarLocator;
