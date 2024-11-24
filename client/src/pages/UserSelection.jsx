import { useState } from 'react';
import { motion } from 'framer-motion';

const users = [
  { id: 1, name: 'Employee 1', role: 'Operator' },
  { id: 2, name: 'Employee 2', role: 'Designer' },
  { id: 3, name: 'Employee 3', role: 'Manager' },
];

const UserSelection = ({ setSelectedUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ironwolf-light to-ironwolf-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-lg shadow-xl w-[480px]"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ironwolf">Select User</h1>
          <p className="text-gray-600">Choose your account to continue</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <motion.button
              key={user.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedUser(user)}
              className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.role}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UserSelection;
