# NaviPark Frontend

Modern React + Vite + Tailwind CSS frontend for the NaviPark Smart Parking System.

## 🚀 Features

- **Real-time Parking Management**: Live parking slot availability and status tracking
- **Vehicle Location Services**: Find parked vehicles by slot ID or license plate
- **Lost & Found System**: Report and search for lost items in the parking facility
- **User Authentication**: Multiple login methods (Google, Phone, Admin bypass)
- **Responsive Design**: Mobile-first PWA with Tailwind CSS
- **Dark Mode Support**: Toggle between light and dark themes
- **Admin Dashboard**: System management and analytics

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite 4 + Tailwind CSS 3
- **Development**: ESLint + Prettier + Vitest + Stylelint
- **Build Tools**: Vite with hot reload and optimization

## 📋 Prerequisites

- Node.js 18+ (tested with Node.js v24.14.0)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd navipark-frontend
npm install
```

### 2. Environment Setup

```bash
# Copy environment variables
cp .env.example .env.development

# Edit as needed
# VITE_API_BASE_URL=http://localhost:3000
# VITE_ENABLE_DEBUG=true
```

### 3. Start Development

```bash
npm run dev
```

### 4. Access Application

- Frontend: http://localhost:5173
- Browser opens automatically with hot reload

**Note**: Make sure the backend is running on http://localhost:3000

## 📚 Development Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run dev:full         # Start both backend and frontend
npm run dev:backend      # Start only backend

# Code Quality
npm run lint             # Fix ESLint issues
npm run lint:check       # Check ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm run test             # Run unit tests
npm run test:ui          # Run tests with UI
npm run test:coverage   # Run tests with coverage

# Build & Deploy
npm run build            # Build for production
npm run preview          # Preview production build
npm run clean            # Clean build artifacts
npm run type-check       # TypeScript type checking
```

## 🏗 Project Structure

```
navipark-pwa/
├── src/
│   ├── components/          # React components
│   │   ├── Auth.jsx         # Authentication
│   │   ├── CarLocator.jsx   # Vehicle location
│   │   ├── ParkingMap.jsx   # Parking visualization
│   │   └── LostFound.jsx    # Lost & found system
│   ├── context/             # React context
│   │   └── AppContext.jsx   # Global state management
│   ├── services/            # API services
│   │   └── api.js           # API client
│   ├── main.jsx             # App entry point
│   ├── App.jsx              # Main app component
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .env.development         # Development variables
├── vite.config.working.js   # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── package.json             # Dependencies and scripts
```

## 🔧 Development Tools

### ESLint + Prettier
- Automatic code formatting on save
- Consistent code style across the team
- Pre-commit hooks for quality control

### Vitest Testing
- Unit tests with React Testing Library
- Component testing with UI interface
- Coverage reporting for quality metrics

### Hot Module Replacement
- Instant updates without page refresh
- Component state preservation during development
- Error overlay for debugging

## 🌍 Environment Variables

Create `.env.development` based on `.env.example`:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# Development Settings
VITE_ENV=development
VITE_ENABLE_DEBUG=true

# Feature Flags
VITE_ENABLE_ANALYTICS=false
```

## 🎨 Styling with Tailwind CSS

- Utility-first CSS framework
- Custom component classes in `src/index.css`
- Dark mode support with CSS variables
- Responsive design patterns

## 📱 PWA Features

- Service worker for offline functionality
- App manifest for native app experience
- Responsive design for all devices

## 🐛 Debugging

- Chrome DevTools integration
- React DevTools support
- Console logging with environment-based levels
- Error boundaries for graceful error handling

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

The build outputs to `dist/` directory with optimized assets.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Node.js Version**: Ensure Node.js 18+ is installed
2. **Port Conflicts**: Change port in vite config if 5173 is in use
3. **Backend Connection**: Ensure backend is running on port 3000
4. **Environment Variables**: Copy `.env.example` to `.env.development`

### Getting Help

- Check the console for error messages
- Verify backend API is accessible
- Ensure all dependencies are installed
- Check network tab for API call failures

---

Built with ❤️ using React, Vite, and Tailwind CSS
