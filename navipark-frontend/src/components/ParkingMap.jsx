import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { parkingAPI } from '../services/api';

const ParkingMap = () => {
  const { carLocation } = useContext(AppContext);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const parkingSlots = await parkingAPI.getSlots({ floor: 'A', zone: 'General' });
        
        // Transform API data to component format
        const formattedSlots = parkingSlots.map(slot => {
          let status = slot.status;
          if (carLocation && carLocation.slot === slot.slot_number) status = 'user'; // blue
          return { 
            id: slot.slot_number, 
            status 
          };
        });
        
        setSlots(formattedSlots);
      } catch (error) {
        console.error('Failed to fetch parking slots:', error);
        // Fallback to mock data
        setSlots(Array.from({ length: 12 }, (_, i) => {
          const id = (i + 1).toString().padStart(2, '0');
          let status = 'available';
          if ([2, 5, 7, 10].includes(i)) status = 'occupied';
          if (carLocation && carLocation.slot === id) status = 'user';
          return { id, status };
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [carLocation]);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Live Map (Zone {carLocation ? carLocation.zone : 'A'})</h2>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Free</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Full</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> You</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {slots.map((slot) => (
          <div 
            key={slot.id} 
            className={`
              h-16 rounded-lg flex items-center justify-center font-bold transition-all
              ${slot.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' : ''}
              ${slot.status === 'occupied' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 opacity-60' : ''}
              ${slot.status === 'user' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40 ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-slate-900 animate-pulse' : ''}
            `}
          >
            {slot.status === 'user' ? 'YOU' : slot.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingMap;
