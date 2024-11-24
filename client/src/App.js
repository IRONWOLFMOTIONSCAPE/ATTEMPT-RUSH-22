import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { syncEngine } from './utils/syncEngine';
import './App.css';

// Initial users data
const initialUsers = [
  {
    name: 'John Doe',
    email: 'john@ironwolf.com',
    role: 'Manager',
    department: 'Production',
    status: 'Active',
    lastActive: '2 hours ago',
    image: '👨‍💼'
  },
  {
    name: 'Jane Smith',
    email: 'jane@ironwolf.com',
    role: 'Layout Artist',
    department: 'Design',
    status: 'Active',
    lastActive: '1 hour ago',
    image: '👩‍🎨'
  }
];

// Login Component
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (username === 'admin' && password === 'admin') {
        toast.success('Login successful! Welcome back.', {
          icon: '👋',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        await new Promise(resolve => setTimeout(resolve, 500));
        onLogin();
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Invalid username or password', {
        icon: '🔐',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-500/30 to-orange-500/30 rounded-full"
        />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "100%", x: Math.random() * 100 + "%", scale: 0 }}
            animate={{
              y: "-100%",
              x: Math.random() * 100 + "%",
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute w-4 h-4 bg-white/10 rounded-full backdrop-blur-sm"
          />
        ))}
      </div>

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md p-8 mx-4"
      >
        {/* Glass card effect */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl" />
        
        {/* Content */}
        <div className="relative space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              className="w-24 h-24 mx-auto mb-4 relative group"
            >
              {/* Wolf Logo */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg transform group-hover:scale-105 transition-all duration-300">
                <svg viewBox="0 0 24 24" className="w-full h-full p-4 text-white">
                  <path
                    fill="currentColor"
                    d="M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M15.63,14.4L12,12.7L8.37,14.4L9.47,10.38L6.4,7.6L10.54,7.17L12,3.4L13.46,7.17L17.6,7.6L14.53,10.38L15.63,14.4Z"
                  />
                </svg>
              </div>
              {/* Glowing effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
            </motion.div>
            
            {/* Company Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
            >
              IRONWOLF DIGITAL PRINTING
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm font-medium text-gray-300 tracking-wider"
            >
              SUBLIMATION ORDERING SYSTEM
            </motion.p>

            {/* Welcome Message */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-gray-200 mt-6"
            >
              {greeting}!
            </motion.h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative group"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-200/50 group-focus-within:text-indigo-200 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-indigo-200/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-indigo-200/50 transition-all duration-200"
                    placeholder="Enter your username"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg pointer-events-none" />
                </motion.div>
              </div>
              <div>
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="relative group"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-200/50 group-focus-within:text-indigo-200 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-indigo-200/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-indigo-200/50 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      className="h-5 w-5 text-indigo-200/50 hover:text-indigo-200 transition-colors duration-200"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      {showPassword ? (
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      ) : (
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.515a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      )}
                    </svg>
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg pointer-events-none" />
                </motion.div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="relative w-full group overflow-hidden rounded-lg p-px"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative px-6 py-3 bg-black/50 backdrop-blur-sm rounded-lg leading-none flex items-center justify-center space-x-2">
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <span className="text-indigo-200 group-hover:text-white transition duration-200">
                      Sign in
                    </span>
                    <svg
                      className="w-5 h-5 text-indigo-200 group-hover:text-white transition duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Footer */}
          <div className="text-center text-indigo-200/50 text-sm flex items-center justify-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure Enterprise Login</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// User Selection Component
function UserSelection({ users, onSelectUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const filteredUsers = users.filter(user => 
    user.status === 'Active' && (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to IRONWOLF</h1>
          <p className="text-indigo-200">Please select your user profile to continue</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, role, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
              🔍
            </span>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              onClick={() => {
                setSelectedId(user.id);
                onSelectUser(user);
              }}
              className={`
                cursor-pointer p-4 rounded-xl transition-all transform hover:scale-105
                ${selectedId === user.id ? 'bg-white shadow-2xl' : 'bg-white/10 hover:bg-white/20'}
              `}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center text-4xl bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full">
                  {user.image}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold mb-1 ${selectedId === user.id ? 'text-gray-900' : 'text-white'}`}>
                    {user.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'Manager' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.department}
                    </span>
                  </div>
                  <p className={`text-sm ${selectedId === user.id ? 'text-gray-600' : 'text-gray-300'}`}>
                    Last active: {user.lastActive}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center text-white/70 mt-8">
            No active users found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
}

// User Management Component
function UserManagement({ users, setUsers }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Layout Artist',
    department: '',
    status: 'Active',
    image: '👤'
  });

  const handleAddUser = async () => {
    try {
      await syncEngine.updateData('users', {
        ...formData,
        lastActive: 'Just now'
      });
      toast.success('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleEditUser = async () => {
    try {
      await syncEngine.updateData('users', {
        id: editingUser.id,
        ...formData
      });
      setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...formData } : user));
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'Layout Artist',
        department: '',
        status: 'Active',
        image: '👤'
      });
      toast.success('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await syncEngine.deleteData('users', userId);
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => setIsAddingUser(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New User
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800">
                    {user.role}
                  </span>
                  <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                    {user.department}
                  </span>
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Last active: {user.lastActive}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingUser(user);
                    setFormData({
                      name: user.name,
                      email: user.email,
                      role: user.role,
                      department: user.department,
                      status: user.status,
                      image: user.image
                    });
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit User Modal */}
      {(isAddingUser || editingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              editingUser ? handleEditUser() : handleAddUser();
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Layout Artist">Layout Artist</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingUser(false);
                    setEditingUser(null);
                    setFormData({
                      name: '',
                      email: '',
                      role: 'Layout Artist',
                      department: '',
                      status: 'Active',
                      image: '👤'
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard Component
function Dashboard({ user, onLogout, users, setUsers, syncStatus }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('Home');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const menuItems = [
    {
      category: "Main",
      items: [
        { name: "Home", icon: "🏠" },
        { name: "Create Order", icon: "📝" },
        { name: "Reports", icon: "📊" },
        { name: "Order Tracking", icon: "🔍" },
        { name: "Order History", icon: "📅" }
      ]
    },
    {
      category: "System",
      items: [
        { 
          name: "Settings", 
          icon: "⚙️",
          isDropdown: true,
          subItems: [
            { name: "User Management", icon: "👥" },
            { name: "Sublimation Types", icon: "🎨" },
            { name: "Backups", icon: "💾" }
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } shadow-xl`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <span className="text-xl font-bold">IRONWOLF</span>
            </motion.div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-xl">
              {user.image}
            </div>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-400">{user.role}</div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {menuItems.map((category) => (
            <div key={category.category} className="mb-6">
              {isSidebarOpen && (
                <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                  {category.category}
                </h2>
              )}
              <ul className="space-y-1">
                {category.items.map((item) => (
                  <li key={item.name}>
                    {item.isDropdown ? (
                      <div>
                        <button
                          onClick={() => setSettingsOpen(!settingsOpen)}
                          className={`w-full flex items-center px-2 py-2 text-sm rounded-lg transition-colors hover:bg-gray-800 ${
                            currentPage === item.name ? 'bg-gray-800 text-white' : 'text-gray-300'
                          }`}
                        >
                          <span className="mr-2">{item.icon}</span>
                          {isSidebarOpen && (
                            <>
                              <span className="flex-1 text-left">{item.name}</span>
                              <span className={`transform transition-transform ${settingsOpen ? 'rotate-180' : ''}`}>
                                ▼
                              </span>
                            </>
                          )}
                        </button>
                        {settingsOpen && isSidebarOpen && (
                          <ul className="ml-4 mt-1 space-y-1">
                            {item.subItems.map((subItem) => (
                              <li key={subItem.name}>
                                <button
                                  onClick={() => setCurrentPage(subItem.name)}
                                  className={`w-full flex items-center px-2 py-2 text-sm rounded-lg transition-colors hover:bg-gray-800 ${
                                    currentPage === subItem.name ? 'bg-gray-800 text-white' : 'text-gray-300'
                                  }`}
                                >
                                  <span className="mr-2">{subItem.icon}</span>
                                  <span>{subItem.name}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setCurrentPage(item.name)}
                        className={`w-full flex items-center px-2 py-2 text-sm rounded-lg transition-colors hover:bg-gray-800 ${
                          currentPage === item.name ? 'bg-gray-800 text-white' : 'text-gray-300'
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {isSidebarOpen && <span>{item.name}</span>}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Logout Button */}
          <div className="absolute bottom-4 w-full left-0 px-4">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-3 px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50"
            >
              <span className="text-xl">🚪</span>
              {isSidebarOpen && (
                <span className="text-sm font-medium">Log Out</span>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Bar */}
        <div className="bg-white h-16 flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">{currentPage}</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              🔔
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              ⚡
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Content */}
            {currentPage === 'Home' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <h2 className="text-lg font-semibold mb-4">Welcome Back!</h2>
                <p className="text-gray-600">
                  Select an option from the sidebar to get started.
                </p>
              </motion.div>
            )}
            {currentPage === 'User Management' && (
              <UserManagement users={users} setUsers={setUsers} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ isOnline: true });

  useEffect(() => {
    // Initial data load
    const loadData = async () => {
      const userData = await syncEngine.getData('users');
      setUsers(userData);
    };
    loadData();

    // Set up sync status monitoring
    const checkSyncStatus = () => {
      setSyncStatus({ isOnline: syncEngine.getOnlineStatus() });
    };
    
    const interval = setInterval(checkSyncStatus, 1000);
    window.addEventListener('online', checkSyncStatus);
    window.addEventListener('offline', checkSyncStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', checkSyncStatus);
      window.removeEventListener('offline', checkSyncStatus);
    };
  }, []);

  const handleAddUser = async (newUser) => {
    try {
      await syncEngine.updateData('users', {
        ...newUser,
        lastActive: 'Just now'
      });
      toast.success('User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleUpdateUser = async (id, updatedUser) => {
    try {
      await syncEngine.updateData('users', {
        id,
        ...updatedUser
      });
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await syncEngine.deleteData('users', id);
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleLogin = (user) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedUser(null);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Add sync status indicator
  const SyncIndicator = () => (
    <div className={`fixed bottom-4 right-4 flex items-center space-x-2 px-3 py-2 rounded-full ${
      syncStatus.isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        syncStatus.isOnline ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <span className="text-sm">
        {syncStatus.isOnline ? 'Synced' : 'Offline'}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : !selectedUser ? (
        <UserSelection users={users} onSelectUser={handleUserSelect} />
      ) : (
        <>
          <Dashboard 
            user={selectedUser} 
            onLogout={handleLogout}
            users={users}
            setUsers={setUsers}
            syncStatus={syncStatus}
          />
          <SyncIndicator />
        </>
      )}
    </div>
  );
}

export default App;
