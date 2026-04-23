const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'navipark-simple.json');

let data = {
  users: [],
  parking_slots: [],
  vehicles: [],
  lost_found_reports: [],
  parking_sessions: []
};

const initDB = () => {
  if (fs.existsSync(dbPath)) {
    data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } else {
    // Seed Data
    data.users = [
      { id: "u1", identifier: "guest@gmail.com", name: "Guest User", role: "user", created_at: new Date().toISOString() },
      { id: "u2", identifier: "+15550000000", name: "Mobile User", role: "user", created_at: new Date().toISOString() },
      { id: "a1", identifier: "admin", name: "Facility Manager", role: "admin", created_at: new Date().toISOString() }
    ];

    data.parking_slots = [
      { id: "B2-A12", floor: "B2", zone: "A", slot_number: "12", status: "available", instructions: JSON.stringify(['Head straight 50m', 'Turn left at Blue pillar', 'Slot is on the right']), vehicle_id: null, user_id: null, occupied_at: null, last_updated: new Date().toISOString() },
      { id: "B1-C05", floor: "B1", zone: "C", slot_number: "05", status: "available", instructions: JSON.stringify(['Take elevator to B1', 'Follow Green arrows', 'Slot is opposite the exit']), vehicle_id: null, user_id: null, occupied_at: null, last_updated: new Date().toISOString() }
    ];

    for (let i = 1; i <= 12; i++) {
      const id = String(i).padStart(2, '0');
      let status = 'available';
      if ([2, 5, 7, 10].includes(i - 1)) status = 'occupied';
      data.parking_slots.push({ 
        id, 
        floor: "A", 
        zone: "General", 
        slot_number: id, 
        status, 
        instructions: JSON.stringify([]),
        vehicle_id: null,
        user_id: null,
        occupied_at: status === 'occupied' ? new Date().toISOString() : null,
        last_updated: new Date().toISOString()
      });
    }

    data.lost_found_reports = [
      { id: 101, item: "Keys with blue lanyard", location: "Zone A Elevator", description: null, status: "Pending Verification", reporter_id: null, reporter_contact: "+15550001234", found_by: null, resolved_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), resolved_at: null },
      { id: 102, item: "Black Leather Wallet", location: "Level B2", description: null, status: "New", reporter_id: null, reporter_contact: "guest@gmail.com", found_by: null, resolved_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), resolved_at: null }
    ];

    saveDB();
    console.log("Simple JSON database initialized and seeded.");
  }
};

const saveDB = () => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Helper functions for database operations
const getDB = () => {
  return data;
};

const query = (table, conditions = {}) => {
  let results = data[table] || [];
  
  // Apply filters
  Object.keys(conditions).forEach(key => {
    if (conditions[key] !== undefined) {
      results = results.filter(item => item[key] === conditions[key]);
    }
  });
  
  return results;
};

const insert = (table, item) => {
  if (!data[table]) {
    data[table] = [];
  }
  
  // Generate ID if not provided
  if (table === 'lost_found_reports' && !item.id) {
    item.id = Date.now();
  } else if (table === 'parking_sessions' && !item.id) {
    item.id = Date.now();
  } else if ((table === 'users' || table === 'vehicles') && !item.id) {
    item.id = Math.random().toString(36).substr(2, 9);
  }
  
  // Add timestamps
  if (!item.created_at) {
    item.created_at = new Date().toISOString();
  }
  if (!item.updated_at) {
    item.updated_at = new Date().toISOString();
  }
  
  data[table].push(item);
  saveDB();
  return item;
};

const update = (table, id, updates) => {
  if (!data[table]) return null;
  
  const index = data[table].findIndex(item => item.id == id);
  if (index === -1) return null;
  
  // Update fields
  Object.keys(updates).forEach(key => {
    data[table][index][key] = updates[key];
  });
  
  // Update timestamp
  data[table][index].updated_at = new Date().toISOString();
  
  saveDB();
  return data[table][index];
};

const remove = (table, id) => {
  if (!data[table]) return false;
  
  const index = data[table].findIndex(item => item.id == id);
  if (index === -1) return false;
  
  data[table].splice(index, 1);
  saveDB();
  return true;
};

module.exports = {
  initDB,
  getDB,
  saveDB,
  query,
  insert,
  update,
  remove
};
