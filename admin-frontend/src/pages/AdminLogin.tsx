import React, { useState } from 'react';
import MonsteraLogo from '../assets/Monstera.svg';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    // TODO: Add authentication logic here
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="p-8 w-full max-w-md">
        <div className="flex justify-center mb-16">
          <img src={MonsteraLogo} alt="Monstera" className="h-12 w-auto" />
        </div>
        <h1 className="text-3xl font-bold text-center text-[#40513B] mb-8">Admin Login</h1>
        
        {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-[#40513B] font-semibold mb-2">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40513B]"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-[#40513B] font-semibold mb-2">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40513B]"
            />
          </div>

          <button type="submit" className="w-full bg-[#40513B] hover:bg-[#8C7A64] text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
