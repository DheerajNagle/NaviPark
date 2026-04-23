const express = require('express');
const cors = require('cors');
const { initDB, query, insert, update, remove } = require('./database-simple');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB
initDB();

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

// --- Parking Routes ---
app.get('/api/parking/slots', (req, res) => {
  try {
    const { floor, zone, status } = req.query;
    
    let conditions = {};
    if (floor) conditions.floor = floor;
    if (zone) conditions.zone = zone;
    if (status) conditions.status = status;
    
    const slots = query('parking_slots', conditions);
    
    // Parse JSON instructions for each slot
    const formattedSlots = slots.map(slot => ({
      ...slot,
      instructions: slot.instructions ? JSON.parse(slot.instructions) : []
    }));
    
    res.json(formattedSlots);
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({ error: 'Failed to fetch parking slots' });
  }
});

app.post('/api/parking/slots/:id/override', (req, res) => {
  try {
    const { id } = req.params;
    const { status, user_id, vehicle_id } = req.body;
    
    // Check if slot exists
    const slot = query('parking_slots', { id })[0];
    if (!slot) return res.status(404).json({ error: "Slot not found" });
    
    // Update slot status
    const updateData = {
      status,
      user_id: user_id || null,
      vehicle_id: vehicle_id || null,
      last_updated: new Date().toISOString(),
      occupied_at: status === 'occupied' ? new Date().toISOString() : null
    };
    
    const updatedSlot = update('parking_slots', id, updateData);
    
    // If slot is being occupied, create parking session
    if (status === 'occupied' && user_id && vehicle_id) {
      insert('parking_sessions', {
        user_id,
        vehicle_id,
        slot_id: id,
        status: 'active',
        start_time: new Date().toISOString()
      });
    }
    
    // If slot is being freed, end parking session
    if (status === 'available') {
      const activeSessions = query('parking_sessions', { slot_id: id, status: 'active' });
      activeSessions.forEach(session => {
        update('parking_sessions', session.id, {
          status: 'completed',
          end_time: new Date().toISOString()
        });
      });
    }
    
    res.json({ success: true, id, status });
  } catch (error) {
    console.error('Override slot error:', error);
    res.status(500).json({ error: 'Failed to update slot status' });
  }
});

app.get('/api/parking/locate/:id', (req, res) => {
  try {
    const { id } = req.params;
    const searchId = id.toUpperCase();
    
    // Search by slot ID
    let slot = query('parking_slots', { id: searchId })[0];
    
    // If not found by slot ID, search by vehicle license plate
    if (!slot) {
      const vehicles = query('vehicles', { license_plate: searchId });
      if (vehicles.length > 0) {
        slot = query('parking_slots', { vehicle_id: vehicles[0].id })[0];
      }
    }
    
    if (!slot) return res.status(404).json({ error: "Car ID not found" });
    
    // Get additional information
    let vehicle = null;
    let user = null;
    
    if (slot.vehicle_id) {
      vehicle = query('vehicles', { id: slot.vehicle_id })[0];
    }
    
    if (slot.user_id) {
      user = query('users', { id: slot.user_id })[0];
    }
    
    // Parse instructions and format response
    const formattedSlot = {
      ...slot,
      instructions: slot.instructions ? JSON.parse(slot.instructions) : [],
      make: vehicle ? vehicle.make : null,
      model: vehicle ? vehicle.model : null,
      color: vehicle ? vehicle.color : null,
      license_plate: vehicle ? vehicle.license_plate : null,
      user_name: user ? user.name : null
    };
    
    res.json(formattedSlot);
  } catch (error) {
    console.error('Locate vehicle error:', error);
    res.status(500).json({ error: 'Failed to locate vehicle' });
  }
});

// --- Reports Routes ---
app.get('/api/reports', (req, res) => {
  try {
    const { status, search } = req.query;
    
    let reports = query('lost_found_reports');
    
    // Apply status filter
    if (status) {
      reports = reports.filter(report => report.status === status);
    }
    
    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      reports = reports.filter(report => 
        report.item.toLowerCase().includes(searchTerm) ||
        report.location.toLowerCase().includes(searchTerm) ||
        (report.description && report.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // Add reporter names
    reports = reports.map(report => {
      const reporter = report.reporter_id ? query('users', { id: report.reporter_id })[0] : null;
      return {
        ...report,
        reporter_name: reporter ? reporter.name : null
      };
    });
    
    // Sort by created_at descending
    reports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

app.post('/api/reports', (req, res) => {
  try {
    const { item, location, description, reporter_contact, reporter_id } = req.body;
    
    const newReport = insert('lost_found_reports', {
      item,
      location,
      description: description || null,
      reporter_contact,
      reporter_id: reporter_id || null
    });
    
    res.status(201).json(newReport);
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

app.put('/api/reports/:id/resolve', (req, res) => {
  try {
    const { id } = req.params;
    const { resolved_by } = req.body;
    
    const updatedReport = update('lost_found_reports', parseInt(id), {
      status: 'Resolved',
      resolved_at: new Date().toISOString(),
      resolved_by: resolved_by || null
    });
    
    if (!updatedReport) {
      return res.status(404).json({ error: "Report not found" });
    }
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Resolve report error:', error);
    res.status(500).json({ error: 'Failed to resolve report' });
  }
});

// --- Vehicle Management Routes ---
app.get('/api/vehicles', (req, res) => {
  try {
    const { user_id } = req.query;
    
    let vehicles = query('vehicles');
    
    // Apply user filter
    if (user_id) {
      vehicles = vehicles.filter(vehicle => vehicle.user_id === user_id);
    }
    
    // Add user names
    vehicles = vehicles.map(vehicle => {
      const user = query('users', { id: vehicle.user_id })[0];
      return {
        ...vehicle,
        user_name: user ? user.name : null
      };
    });
    
    // Sort by created_at descending
    vehicles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

app.post('/api/vehicles', (req, res) => {
  try {
    const { user_id, make, model, color, license_plate, vehicle_type } = req.body;
    
    // Check if license plate already exists
    const existing = query('vehicles', { license_plate })[0];
    if (existing) {
      return res.status(400).json({ error: 'License plate already registered' });
    }
    
    const newVehicle = insert('vehicles', {
      user_id,
      make,
      model,
      color,
      license_plate,
      vehicle_type: vehicle_type || 'car'
    });
    
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

app.put('/api/vehicles/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { make, model, color, license_plate, vehicle_type } = req.body;
    
    // Check if vehicle exists
    const existing = query('vehicles', { id })[0];
    if (!existing) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    // Check if license plate conflicts with another vehicle
    if (license_plate) {
      const conflict = query('vehicles', { license_plate }).find(v => v.id !== id);
      if (conflict) {
        return res.status(400).json({ error: 'License plate already registered to another vehicle' });
      }
    }
    
    const updatedVehicle = update('vehicles', id, {
      make,
      model,
      color,
      license_plate,
      vehicle_type: vehicle_type || 'car',
      updated_at: new Date().toISOString()
    });
    
    res.json(updatedVehicle);
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

app.delete('/api/vehicles/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if vehicle is currently parked
    const parked = query('parking_slots', { vehicle_id: id, status: 'occupied' })[0];
    if (parked) {
      return res.status(400).json({ error: 'Cannot delete vehicle currently parked' });
    }
    
    const success = remove('vehicles', id);
    
    if (!success) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

// --- Parking Sessions Routes ---
app.get('/api/parking/sessions', (req, res) => {
  try {
    const { user_id, status } = req.query;
    const db = getDB();
    
    let query = `
      SELECT ps.*, u.name as user_name, v.make, v.model, v.license_plate, 
             ps_floor.floor, ps_floor.zone, ps_floor.slot_number
      FROM parking_sessions ps
      LEFT JOIN users u ON ps.user_id = u.id
      LEFT JOIN vehicles v ON ps.vehicle_id = v.id
      LEFT JOIN parking_slots ps_floor ON ps.slot_id = ps_floor.id
    `;
    const params = [];
    const conditions = [];
    
    if (user_id) {
      conditions.push('ps.user_id = ?');
      params.push(user_id);
    }
    
    if (status) {
      conditions.push('ps.status = ?');
      params.push(status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY ps.start_time DESC';
    
    const sessions = db.prepare(query).all(...params);
    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch parking sessions' });
  }
});

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
