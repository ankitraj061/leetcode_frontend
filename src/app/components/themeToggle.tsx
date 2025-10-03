'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { axiosClient } from '../utils/axiosClient';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  role: string;
  username: string;
  profilePicture?: string;
  theme: string;
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useSelector((state: any) => state.auth);

  const updateUserTheme = async (theme: string) => {
    if (!user?._id) return;
    try {
      await axiosClient.post(`${backendUrl}/api/theme`, { theme });

    } catch (error) {
      console.error('Failed to update user theme:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateUserTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 bg-custom-secondary animate-pulse rounded-md"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-custom-secondary hover:bg-gray-300 dark:hover:bg-gray-600 border border-custom-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <span className="text-xl">
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
