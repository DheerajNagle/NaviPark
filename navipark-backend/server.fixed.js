const express = require('express');
const cors = require('cors');
const { initDB, query, insert, update, remove } = require('./database-simple');
const adminVehiclesRoutes = require('./routes/adminVehicles');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB
initDB();

// --- Root Route ---
app.get('/', (req, res) => {
  res.json({
    message: 'NaviPark Backend API is running',
    status: 'active',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      parking: '/api/parking/slots',
      vehicles: '/api/vehicles',
      reports: '/api/reports',
      health: '/api/system/health'
    }
  });
});

// --- Auth Routes ---
app.post('/api/auth/login', (req, res) => {
  try {
    const { identifier, method, bypassRole } = req.body;
    
    if (bypassRole === 'admin') {
      const adminUser = query('users', { role: 'admin' })[0];
      if (!adminUser) return res.status(500).json({ error: "Admin not found" });
      return res.json(adminUser);
    }

    // Find existing user
    let user = query('users', { identifier })[0];
    
    if (!user) {
      // Create new user
      const id = Math.random().toString(36).substr(2, 9);
      const name = method === 'Google' ? 'Google User' : 'Mobile User';
      user = insert('users', { id, identifier, name, role: 'user' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// --- Admin Vehicle Management Routes ---
app.use('/api/vehicles', adminVehiclesRoutes);

// --- System Health (Admin) ---
app.get('/api/system/health', (req, res) => {
  try {
    const userCount = query('users').length;
    const slotCount = query('parking_slots').length;
    const occupiedSlots = query('parking_slots', { status: 'occupied' }).length;
    const vehicleCount = query('vehicles').length;
    const reportCount = query('lost_found_reports').length;
    const activeSessions = query('parking_sessions', { status: 'active' }).length;
    
    res.json({
      activeUsers: userCount,
      totalSlots: slotCount,
      occupiedSlots,
      availableSlots: slotCount - occupiedSlots,
      totalVehicles: vehicleCount,
      totalReports: reportCount,
      activeSessions,
      status: "All Systems Operational"
    });
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({ error: 'Failed to get system health' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`NaviPark Backend running on http://localhost:${PORT}`);
});
