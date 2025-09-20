// src/components/Navbar.js
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Docs', href: '/docs' },
  { name: 'Downloads', href: '/downloads' },
  { name: 'Verify Certificate', href: '/verify-certificate' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full py-4 backdrop-filter backdrop-blur-md bg-white/10 border-b border-white/20">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          href="/"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-lg"
        >
          EcoWipe
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-gray-200 hover:text-orange-500 transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} px-4 pt-4 pb-2 backdrop-filter backdrop-blur-md bg-white/10 border-t border-white/20 transition-all duration-300`}>
        <div className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsOpen(false)} 
              className="text-gray-200 hover:text-orange-500 transition-colors duration-300 py-2"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}