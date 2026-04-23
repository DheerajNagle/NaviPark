const express = require('express');
const { query, insert } = require('../database-simple');

const router = express.Router();

// In-memory storage for admin vehicles
let adminVehicles = [];

// GET / - Fetch all vehicles (mounted at /api/vehicles)
router.get('/', (req, res) => {
  try {
    console.log('GET /api/vehicles - Fetching all vehicles');
    
    // Return both admin vehicles and regular vehicles for complete view
    const regularVehicles = query('vehicles');
    const allVehicles = [
      ...adminVehicles.map(v => ({ ...v, source: 'admin' })),
      ...regularVehicles.map(v => ({ ...v, source: 'regular' }))
    ];
    
    // Sort by created_at descending
    allVehicles.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    
    console.log(`Returning ${allVehicles.length} vehicles`);
    res.json(allVehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// POST /add - Add a new vehicle (mounted at /api/vehicles/add)
router.post('/add', (req, res) => {
  try {
    console.log('POST /api/vehicles/add - Adding new vehicle');
    console.log('Request body:', req.body);
    
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
    
    console.log('Vehicle added successfully:', newVehicle);
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

// DELETE /:id - Remove a vehicle (mounted at /api/vehicles/:id)
router.delete('/:id', (req, res) => {
  try {
    console.log(`DELETE /api/vehicles/${req.params.id} - Removing vehicle`);
    
    const { id } = req.params;
    
    const initialLength = adminVehicles.length;
    adminVehicles = adminVehicles.filter(v => v.id !== id);
    
    if (adminVehicles.length === initialLength) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    console.log('Vehicle removed successfully');
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
