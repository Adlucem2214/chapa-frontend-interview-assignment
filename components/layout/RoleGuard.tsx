"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';
import { Button } from '../ui/Button';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-chapa-white dark:bg-chapa-dark text-foreground gap-4">
        <svg className="animate-spin h-8 w-8 text-chapa-green" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm font-medium text-chapa-slate dark:text-zinc-400">
          Authenticating secure session...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-chapa-white dark:bg-chapa-dark text-foreground px-6 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950/20 text-chapa-red rounded-full flex items-center justify-center mb-6 border border-red-200 dark:border-red-900/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
        <p className="text-sm text-chapa-slate dark:text-zinc-400 mt-2 max-w-md">
          Your credentials ({user.email}) are configured for the role of{' '}
          <strong className="text-foreground font-semibold">{user.role}</strong>. You do not
          have permissions to view this terminal area.
        </p>

        <div className="flex gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            Change Account Role
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (user.role === 'super_admin') {
                router.push('/dashboard/super-admin');
              } else {
                router.push(`/dashboard/${user.role}`);
              }
            }}
          >
            Go to My Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
