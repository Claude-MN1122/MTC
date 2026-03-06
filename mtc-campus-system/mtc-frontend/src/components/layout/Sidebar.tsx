'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiUsers, 
  FiKey, 
  FiCreditCard,
  FiBarChart2, 
  FiCode,
  FiLogOut,
  FiSettings,
  FiHelpCircle
} from 'react-icons/fi';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <FiHome /> },
  { name: 'Students', href: '/dashboard/students', icon: <FiUsers /> },
  { name: 'ID Cards', href: '/dashboard/id-cards', icon: <FiKey /> },
  { name: 'Accommodation', href: '/dashboard/accommodation', icon: <FiCreditCard /> },
  { name: 'Dining', href: '/dashboard/dining', icon: <FiCode /> },
  { name: 'QR Scanner', href: '/dashboard/qr-scanner', icon: <FiCode /> },
  { name: 'Analytics', href: '/dashboard/analytics', icon: <FiBarChart2 /> },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white border-r border-border-light
        transition-all duration-300 ease-in-out z-40
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-light">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-h4 font-bold text-text-primary">MTC Campus</h1>
              <p className="text-xs text-text-muted">Management System</p>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg">M</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="py-4 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-200 ease-in-out
                group relative
                ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.name : undefined}
            >
              <span
                className={`
                  flex-shrink-0 text-lg
                  ${isActive ? 'text-primary-600' : 'text-text-muted group-hover:text-primary-500'}
                `}
              >
                {item.icon}
              </span>
              
              {!collapsed && (
                <span className="font-medium text-sm">{item.name}</span>
              )}
              
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border-light bg-white">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
          >
            <FiSettings className="text-lg" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
          
          <Link
            href="/help"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
          >
            <FiHelpCircle className="text-lg" />
            <span className="font-medium text-sm">Help & Support</span>
          </Link>
          
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-error-500 hover:bg-error-50 transition-colors mt-1">
            <FiLogOut className="text-lg" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      )}
      
      {collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border-light bg-white space-y-2">
          <button
            className="w-full flex justify-center p-2.5 rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
            title="Settings"
          >
            <FiSettings className="text-lg" />
          </button>
          <button
            className="w-full flex justify-center p-2.5 rounded-lg text-error-500 hover:bg-error-50 transition-colors"
            title="Logout"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>
      )}
    </aside>
  );
};

export type { SidebarProps };
