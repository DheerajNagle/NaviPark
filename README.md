<<<<<<< HEAD
# NaviPark Smart Parking System

A full-stack smart parking management application with real-time parking slot tracking, vehicle location services, and lost & found reporting.

## 🏗 Project Structure

```
navipark/
├── navipark-frontend/     # React + Vite + Tailwind CSS
├── navipark-backend/      # Node.js + Express API
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested with Node.js v24.14.0)
- npm or yarn package manager

### 1. Start Backend

```bash
cd navipark-backend
npm install
npm run dev
```

Backend runs on: http://localhost:3000

### 2. Start Frontend

```bash
cd navipark-frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

### 3. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/system/health

## 📋 Individual Project Setup

### Frontend (navipark-frontend)
- React 18 + Vite 4 + Tailwind CSS 3
- Hot reload and development optimizations
- ESLint + Prettier + Vitest
- PWA support

See: [navipark-frontend/README.md](./navipark-frontend/README.md)

### Backend (navipark-backend)
- Node.js + Express
- JSON file-based database
- RESTful API with CORS
- Comprehensive error handling

See: [navipark-backend/README.md](./navipark-backend/README.md)

## 🔧 Development Workflow

### Run Both Servers Simultaneously

```bash
# Terminal 1 - Backend
cd navipark-backend
npm run dev

# Terminal 2 - Frontend
cd navipark-frontend
npm run dev
```

### Code Quality

```bash
# Frontend
cd navipark-frontend
npm run lint
npm run format

# Backend (manual linting)
cd navipark-backend
```

## 🚀 Features

- **Real-time Parking Management**: Live parking slot availability
- **Vehicle Location Services**: Find parked vehicles by slot ID
- **Lost & Found System**: Report and search for lost items
- **User Authentication**: Multiple login methods
- **Responsive Design**: Mobile-first PWA
- **Dark Mode Support**: Toggle between themes
- **Admin Dashboard**: System management

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Parking Management
- `GET /api/parking/slots` - Get all parking slots
- `POST /api/parking/locate` - Locate vehicle

### Lost & Found
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Add new vehicle

### System
- `GET /api/system/health` - System health check

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 4, Tailwind CSS 3
- **Backend**: Node.js, Express
- **Database**: JSON file-based storage
- **Development**: ESLint, Prettier, Vitest, Nodemon

## 🚀 Deployment

### Frontend
```bash
cd navipark-frontend
npm run build
```

### Backend
```bash
cd navipark-backend
npm start
```

## 🆘 Troubleshooting

1. **Port conflicts**: Change ports in respective config files
2. **CORS issues**: Verify frontend origin is allowed in backend
3. **Database errors**: Check JSON file permissions
4. **Build failures**: Clear node_modules and reinstall

---

Built with ❤️ using React, Vite, Node.js, and Express
=======
# NaviPark
Design for Real-World Parking &amp; Public Interaction Systems
>>>>>>> b774da8149a8f7626415d7e0f7ce84afa64575cd
