import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  PlusCircleIcon,
  ChartBarIcon,
  ClockIcon,
  ClipboardListIcon,
  CogIcon,
  UserGroupIcon,
  TagIcon,
  DatabaseIcon,
} from '@heroicons/react/outline';

const menuItems = [
  { name: 'Home', icon: HomeIcon, path: '/dashboard' },
  { name: 'Create Order', icon: PlusCircleIcon, path: '/dashboard/create-order' },
  { name: 'Reports', icon: ChartBarIcon, path: '/dashboard/reports' },
  { name: 'Order Tracking', icon: ClockIcon, path: '/dashboard/order-tracking' },
  { name: 'Order History', icon: ClipboardListIcon, path: '/dashboard/order-history' },
  { name: 'Settings', icon: CogIcon, path: '/dashboard/settings' },
  { name: 'User Management', icon: UserGroupIcon, path: '/dashboard/users' },
  { name: 'Sublimation Types', icon: TagIcon, path: '/dashboard/sublimation-types' },
  { name: 'Backups', icon: DatabaseIcon, path: '/dashboard/backups' },
];

const Dashboard = ({ user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        className="w-72 bg-white shadow-lg"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-ironwolf">IRONWOLF</h1>
          <p className="text-sm text-gray-600">Sublimation System</p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors duration-200"
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex items-center">
              <span className="mr-2">{user.name}</span>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route path="/" element={<h1>Welcome to Dashboard</h1>} />
            <Route path="/create-order" element={<h1>Create Order</h1>} />
            <Route path="/reports" element={<h1>Reports</h1>} />
            <Route path="/order-tracking" element={<h1>Order Tracking</h1>} />
            <Route path="/order-history" element={<h1>Order History</h1>} />
            <Route path="/settings" element={<h1>Settings</h1>} />
            <Route path="/users" element={<h1>User Management</h1>} />
            <Route path="/sublimation-types" element={<h1>Sublimation Types</h1>} />
            <Route path="/backups" element={<h1>Backups</h1>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
