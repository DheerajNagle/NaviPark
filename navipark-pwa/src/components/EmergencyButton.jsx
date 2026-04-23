import { AlertTriangle } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const EmergencyButton = () => {
  const { carLocation } = useContext(AppContext);

  const handleEmergency = () => {
    const locString = carLocation 
      ? `Floor ${carLocation.floor}, Zone ${carLocation.zone}, Slot ${carLocation.slot}` 
      : 'Unknown location';
    
    alert(`SECURITY NOTIFIED!\n\nLocation shared: ${locString}\n\nPlease stay calm, help is on the way.`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={handleEmergency}
        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-xl shadow-red-500/30 flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-500/50"
        aria-label="Emergency Help"
      >
        <AlertTriangle size={28} />
      </button>
    </div>
  );
};

export default EmergencyButton;
