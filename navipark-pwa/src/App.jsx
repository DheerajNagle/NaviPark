import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CarLocator from './components/CarLocator';
import ParkingMap from './components/ParkingMap';
import Timer from './components/Timer';
import LostFound from './components/LostFound';
import EmergencyButton from './components/EmergencyButton';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const { currentUser, userRole } = useContext(AppContext);

  return (
    <div className="min-h-screen pb-24">
      {currentUser && <Navbar />}
      
      <main className="max-w-md mx-auto p-4 space-y-6 mt-2">
        {!currentUser ? (
          <Auth />
        ) : userRole === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            <CarLocator />
            <Timer />
            <Dashboard />
            <ParkingMap />
            <LostFound />
          </>
        )}
      </main>

      {currentUser && userRole !== 'admin' && <EmergencyButton />}
    </div>
  );
}

export default App;
