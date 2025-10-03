// components/Navbar.tsx
'use client';

import { ThemeToggle } from '@/app/components/themeToggle';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '@/app/authSlice';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  role: string;
  username: string;
  subscriptionType?: 'free' | 'premium';
  profilePicture?: string;
  theme: string;
}

// User Profile Dropdown Component
function UserProfileDropdown({ user }: { user: User }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Generate initials for fallback avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
     {/* Profile Button */}
<button
  onClick={() => setIsOpen(!isOpen)}
  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
  aria-expanded={isOpen}
>
  {user.profilePicture ? (
    <div className="relative">
      <Image
        src={user.profilePicture}
        alt={`${user.firstName} ${user.lastName}`}
        width={32}
        height={32}
        className={`rounded-full border-2 ${
          user.subscriptionType === 'premium'
            ? 'border-yellow-400 shadow-md shadow-yellow-500 animate-pulse'
            : 'border-border-primary'
        }`}
      />
      {user.subscriptionType === 'premium' && (
        <span className="absolute -top-5 right-1 text-yellow-400 text-lg">👑</span>
      )}
    </div>
  ) : (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold relative ${
        user.subscriptionType === 'premium'
          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 border-2 border-yellow-400 animate-pulse'
          : 'bg-brand'
      }`}
    >
      {getInitials(user.firstName, user.lastName)}
      {user.subscriptionType === 'premium' && (
        <span className="absolute -top-1 -right-1 text-yellow-400 text-lg">👑</span>
      )}
    </div>
  )}
</button>


      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-elevated border border-primary rounded-lg shadow-lg py-2 z-50">
          {/* User Info & Profile Link */}
          <Link
            href={`/${user.username}`}
            className="flex items-center px-4 py-2 text-sm text-primary hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <p className="font-medium text-primary">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-secondary">@{user.username}</p>
            </div>
          </Link>

          <div className="border-t border-primary my-1"></div>

          <button
            onClick={handleLogout}
            className="flex items-center w-full cursor-pointer px-4 py-2 text-sm text-error hover:bg-secondary transition-colors"
          >
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  return (
    <nav className="bg-elevated border-b border-primary sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
             <Link href="/">
            <div className="flex items-center space-x-2">
               
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-inverse font-bold text-sm">TC</span>
              </div>
              <span className="text-xl font-bold text-primary">TrueCode</span>
             
            </div>
             </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link href="/problems" className="text-primary hover:text-brand transition-colors">Problems</Link>
              <Link href="/contests" className="text-secondary hover:text-brand transition-colors">Contest</Link>
              <Link href="/discuss" className="text-secondary hover:text-brand transition-colors">Discuss</Link>
              <Link href="/calendar" className="text-secondary hover:text-brand transition-colors">Calendar</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Conditional Rendering: Profile Dropdown or Sign In */}
            {isAuthenticated && user ? (
              <UserProfileDropdown user={user} />
            ) : (
              <>
                <Link href="/accounts/login" className="btn-secondary text-sm">Sign In</Link>
                <Link href="/accounts/signup" className="btn-primary text-sm">Sign Up</Link>
              </>
            )}
            
            <Link href="/premium" className="btn-primary text-sm">{user?.subscriptionType === 'premium' ? 'See Premium Features' : 'Upgrade to Premium'}</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
