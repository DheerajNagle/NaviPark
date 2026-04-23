import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null); // null means logged out
  const [userRole, setUserRole] = useState('user'); // 'user' or 'admin'

  const [darkMode, setDarkMode] = useState(true);
  const [accessibility, setAccessibility] = useState(false);
  
  // Location & Navigation State
  const [carLocation, setCarLocation] = useState(null); // { id, floor, zone, slot }
  
  // Vehicle Details
  const [vehicleDetails, setVehicleDetails] = useState({ plate: '', notes: '' });

  // Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Apply accessibility mode
  useEffect(() => {
    if (accessibility) {
      document.documentElement.classList.add('accessible');
    } else {
      document.documentElement.classList.remove('accessible');
    }
  }, [accessibility]);

  // Timer Effect
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      userRole, setUserRole,
      darkMode, setDarkMode,
      accessibility, setAccessibility,
      carLocation, setCarLocation,
      vehicleDetails, setVehicleDetails,
      timerActive, setTimerActive,
      secondsElapsed, setSecondsElapsed
    }}>
      {children}
    </AppContext.Provider>
  );
};
