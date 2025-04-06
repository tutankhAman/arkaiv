import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Compass, BookOpen, Info, User, LogOut } from 'lucide-react';
import { NavBar } from './ui/tubelight-navbar';

const Navbar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    {
      name: 'Dashboard',
      url: '/',
      icon: Home,
    },
    {
      name: 'Discover',
      url: '/discover',
      icon: Compass,
    },
    {
      name: 'Digest',
      url: '/digest',
      icon: BookOpen,
    },
    {
      name: 'About',
      url: '/about',
      icon: Info,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4">
      <div className="relative">
        <NavBar items={navItems} />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
            >
              <User className="h-6 w-6" />
              <span className="hidden md:inline">{user.username}</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar; 