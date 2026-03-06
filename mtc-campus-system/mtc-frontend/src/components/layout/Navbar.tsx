'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiSearch, FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface NavbarProps {
  onMenuClick?: () => void;
  pageTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, pageTitle }) => {
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-border-light">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-surface transition-colors"
            aria-label="Toggle menu"
          >
            <FiMenu className="text-xl text-text-secondary" />
          </button>

          {/* Page Title */}
          {pageTitle && (
            <div className="hidden sm:block">
              <h2 className="text-h4 font-semibold text-text-primary">{pageTitle}</h2>
              <p className="text-xs text-text-muted">Welcome back</p>
            </div>
          )}
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className={`relative transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''}`}>
            <Input
              type="text"
              placeholder="Search students, rooms, meals..."
              leftIcon={<FiSearch className="text-lg" />}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-surface"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
            aria-label="Search"
          >
            <FiSearch className="text-xl text-text-secondary" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-surface transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FiSun className="text-xl text-text-secondary" />
            ) : (
              <FiMoon className="text-xl text-text-secondary" />
            )}
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-surface transition-colors"
            aria-label="Notifications"
          >
            <FiBell className="text-xl text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full border-2 border-white" />
          </button>

          {/* User Profile */}
          <div className="ml-2 pl-4 border-l border-border-light">
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface transition-colors">
              <Avatar name="Admin User" size="md" />
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-text-primary">Admin User</p>
                <p className="text-xs text-text-muted">Administrator</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export type { NavbarProps };
