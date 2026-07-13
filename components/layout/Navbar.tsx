"use client"; 

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';


export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleBadgeVariant = (role: string) => {
    if (role === 'super_admin') return 'failed'; 
    if (role === 'admin') return 'pending';       
    return 'success';                            
  };

  const getRoleLabel = (role: string) => {
    if (role === 'super_admin') return 'Super Admin';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <header className="h-16 border-b border-chapa-border-light dark:border-chapa-border-dark flex items-center justify-between px-8 bg-white dark:bg-chapa-dark/30 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-chapa-slate dark:text-zinc-400">
          Payment Console
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-chapa-slate dark:text-zinc-400">
              Session:
            </span>
            <Badge variant={getRoleBadgeVariant(user.role)}>
              {getRoleLabel(user.role)}
            </Badge>
          </div>
        )}

        <ThemeToggle />

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="text-xs h-9"
          aria-label="Sign out of current account"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Logout
        </Button>
      </div>
    </header>
  );
};
