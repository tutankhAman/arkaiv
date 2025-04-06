import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, BookOpen, Info } from 'lucide-react';
import { NavBar } from './ui/tubelight-navbar';

const Navbar = () => {
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4">
      <NavBar items={navItems} />
    </div>
  );
};

export default Navbar; 