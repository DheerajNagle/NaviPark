# NaviPark Backend

Node.js + Express REST API for the NaviPark Smart Parking System.

## 🚀 Features

- **RESTful API**: Complete CRUD operations for parking management
- **JSON Database**: Simple file-based data storage
- **CORS Support**: Cross-origin requests from frontend
- **Error Handling**: Comprehensive error responses
- **Data Validation**: Input validation and sanitization

## 🛠 Tech Stack

- **Backend**: Node.js + Express
- **Database**: JSON file-based storage
- **Development**: Nodemon for auto-restart

## 📋 Prerequisites

- Node.js 18+ (tested with Node.js v24.14.0)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd navipark-backend
npm install
```

### 2. Start Development

```bash
npm run dev
```

### 3. Access API

- Backend API: http://localhost:3000
- Health check: http://localhost:3000/api/system/health

## 📚 Available Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Parking Management
- `GET /api/parking/slots` - Get all parking slots
- `GET /api/parking/slots/:id` - Get specific slot
- `PUT /api/parking/slots/:id` - Update slot status
- `POST /api/parking/locate` - Locate vehicle

### Lost & Found
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Add new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### System
- `GET /api/system/health` - System health check

## 📚 Development Scripts

```bash
npm start    # Start production server
npm run dev  # Start development server with auto-restart
```

## 🗄 Database Structure

The application uses a JSON file-based database (`navipark-simple.json`) with the following structure:

```json
{
  "users": [...],
  "parkingSlots": [...],
  "vehicles": [...],
  "lostFoundReports": [...],
  "parkingSessions": [...]
}
```

## 🔧 Configuration

The server runs on port 3000 by default. You can modify this in `server.js`.

## 🚀 Deployment

For production deployment:

1. Set environment variables
2. Run `npm start`
3. Consider using a process manager like PM2

## 🆘 Troubleshooting

1. **Port conflicts**: Change port in server.js
2. **Database errors**: Check JSON file permissions
3. **CORS issues**: Verify frontend origin is allowed
