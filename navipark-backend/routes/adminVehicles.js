const express = require('express');
const { query, insert } = require('../database-simple');

const router = express.Router();

// In-memory storage for admin vehicles (as requested)
let adminVehicles = [];

// GET /api/vehicles - Fetch all vehicles
router.get('/', (req, res, next) => {
  try {
    const { user_id } = req.query;
    let regularVehicles = query('vehicles');
    
    if (user_id) {
      regularVehicles = regularVehicles.filter(vehicle => vehicle.user_id === user_id);
    }
    
    regularVehicles = regularVehicles.map(vehicle => {
      const user = query('users', { id: vehicle.user_id })[0];
      return {
        ...vehicle,
        user_name: user ? user.name : null
      };
    });

    const allVehicles = [
      ...adminVehicles.map(v => ({ ...v, source: 'admin' })),
      ...regularVehicles.map(v => ({ ...v, source: 'regular' }))
    ];
    
    // Sort by created_at descending
    allVehicles.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
    
    res.json(allVehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// POST /api/vehicles/add - Add a new vehicle
router.post('/add', (req, res) => {
  try {
    const { vehicleNumber, ownerName, slotNumber } = req.body;
    
    // Validation
    if (!vehicleNumber || !ownerName || !slotNumber) {
      return res.status(400).json({ 
        error: 'All fields are required',
        missing: {
          vehicleNumber: !vehicleNumber,
          ownerName: !ownerName,
          slotNumber: !slotNumber
        }
      });
    }
    
    // Validate vehicle number format (alphanumeric, 3-10 characters)
    if (!/^[A-Za-z0-9]{3,10}$/.test(vehicleNumber)) {
      return res.status(400).json({ 
        error: 'Vehicle number must be 3-10 alphanumeric characters' 
      });
    }
    
    // Validate owner name (at least 2 characters, letters and spaces only)
    if (!/^[A-Za-z\s]{2,50}$/.test(ownerName)) {
      return res.status(400).json({ 
        error: 'Owner name must be 2-50 letters and spaces only' 
      });
    }
    
    // Validate slot number format
    if (!/^[A-Za-z0-9\-]{1,10}$/.test(slotNumber)) {
      return res.status(400).json({ 
        error: 'Slot number must be 1-10 alphanumeric characters' 
      });
    }
    
    // Check if vehicle number already exists in admin vehicles
    const existingAdminVehicle = adminVehicles.find(v => 
      v.vehicleNumber.toLowerCase() === vehicleNumber.toLowerCase()
    );
    
    if (existingAdminVehicle) {
      return res.status(400).json({ 
        error: 'Vehicle number already exists' 
      });
    }
    
    // Check if slot is already occupied
    const occupiedSlot = adminVehicles.find(v => 
      v.slotNumber.toLowerCase() === slotNumber.toLowerCase()
    );
    
    if (occupiedSlot) {
      return res.status(400).json({ 
        error: 'Slot is already occupied' 
      });
    }
    
    // Create new vehicle
    const newVehicle = {
      id: Math.random().toString(36).substr(2, 9),
      vehicleNumber: vehicleNumber.toUpperCase(),
      ownerName: ownerName.trim(),
      slotNumber: slotNumber.toUpperCase(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    // Add to in-memory storage
    adminVehicles.push(newVehicle);
    
    res.status(201).json({
      success: true,
      vehicle: newVehicle,
      message: 'Vehicle added successfully'
    });
    
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// DELETE /api/vehicles/:id - Remove a vehicle (bonus functionality)
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    
    const initialLength = adminVehicles.length;
    adminVehicles = adminVehicles.filter(v => v.id !== id);
    
    if (adminVehicles.length === initialLength) {
      return next();
    }
    
    res.json({ 
      success: true, 
      message: 'Vehicle removed successfully' 
    });
    
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

module.exports = router;
