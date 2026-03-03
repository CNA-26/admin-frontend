import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MonsteraLogo from '../assets/Monstera.svg';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate('/', { replace: true });
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
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
            <label htmlFor="email" className="block text-[#40513B] font-semibold mb-2">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#40513B]"
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
              className="w-full px-4 py-2 border border-gray-300 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#40513B]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#8c7a64] hover:bg-[#7a6a54] disabled:opacity-70 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <a
            href="https://store-frontend-git-store-frontend.2.rahtiapp.fi/login"
            className="mt-3 w-full inline-block text-center border border-[#8c7a64] text-[#8c7a64] hover:bg-[#f3efe9] font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Back to User Login
          </a>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
