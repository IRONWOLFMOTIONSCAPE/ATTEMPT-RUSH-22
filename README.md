# IRONWOLF SUBLIMATION SYSTEM

A comprehensive order management system for Ironwolf Sublimation with user authentication, order tracking, reporting, and analytics.

## Features

- Admin and Employee user roles
- Secure authentication system
- Order creation and management
- Real-time order tracking
- Reporting and analytics
- Local data storage with SQLite
- Cross-PC data synchronization
- Invoice generation and printing
- Modern UI with smooth animations

## Tech Stack

- Frontend: React with Tailwind CSS
- Backend: Node.js with Express
- Database: SQLite
- Authentication: JWT
- UI Components: Headless UI
- Icons: Heroicons
- Animations: Framer Motion

## Setup Instructions

1. Install dependencies:
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   ```

2. Start the development servers:
   ```bash
   # Start backend server (from root directory)
   npm run dev
   
   # Start frontend server (from client directory)
   npm start
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Default Admin Credentials

- Username: admin
- Password: admin

## Project Structure

```
ironwolf-sublimation/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   └── assets/        # Static assets
│   └── public/            # Public assets
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   └── middleware/       # Custom middleware
└── database.sqlite       # SQLite database
```

## Features in Development

- [ ] Advanced reporting dashboard
- [ ] Automated backup system
- [ ] Custom invoice templates
- [ ] Bulk order processing
- [ ] Email notifications
- [ ] Mobile responsive design

## License

This project is proprietary software owned by Ironwolf Sublimation.
