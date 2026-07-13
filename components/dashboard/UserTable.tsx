"use client";

import React, { useState, useEffect } from 'react';
import { AppUser } from '../../types';
import { mockApi } from '../../services/mockApi';
import { Toggle } from '../ui/Toggle';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';

interface UserTableProps {
  className?: string;
}

export const UserTable: React.FC<UserTableProps> = ({ className = '' }) => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await mockApi.getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users', err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleToggleActive = async (userId: string) => {
    if (updatingId) return;

    setUpdatingId(userId);
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, active: !u.active } : u))
    );

    try {
      await mockApi.toggleUserActive(userId);
    } catch (err) {
      console.error('Failed to toggle user state, reverting', err);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, active: !u.active } : u))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <tr key={`user-skel-${idx}`} className="border-b border-chapa-border-light dark:border-chapa-border-dark">
        <td className="p-4"><Skeleton className="h-4 w-32" /></td>
        <td className="p-4"><Skeleton className="h-4 w-40" /></td>
        <td className="p-4"><Skeleton className="h-4 w-20" /></td>
        <td className="p-4"><Skeleton className="h-6 w-12" /></td>
      </tr>
    ));
  };

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-chapa-border-light dark:border-chapa-border-dark bg-white dark:bg-chapa-dark/40 shadow-sm ${className}`}>
      <div className="px-6 py-4 border-b border-chapa-border-light dark:border-chapa-border-dark flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground text-base">User & Merchant Accounts</h3>
          <p className="text-xs text-chapa-slate dark:text-zinc-500">
            Control terminal access levels and registration status
          </p>
        </div>
        <Badge variant="neutral">
          {loading ? 'Retrieving...' : `${users.length} Users`}
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-chapa-border-light dark:border-chapa-border-dark bg-zinc-50 dark:bg-zinc-800/10 text-xs font-semibold uppercase tracking-wider text-chapa-slate dark:text-zinc-500">
              <th className="p-4">Full Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">User Role</th>
              <th className="p-4">Account Status</th>
              <th className="p-4">Access Toggle</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-chapa-border-light dark:divide-chapa-border-dark text-sm">
            {loading ? (
              renderSkeletons()
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-chapa-slate dark:text-zinc-500">
                  No registered users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 font-medium text-foreground">
                    {u.name}
                  </td>
                  <td className="p-4 text-chapa-slate dark:text-zinc-300">
                    {u.email}
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-foreground border border-chapa-border-light dark:border-chapa-border-dark">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.active ? 'success' : 'neutral'}>
                      {u.active ? 'Active' : 'Suspended'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Toggle
                      checked={u.active}
                      disabled={updatingId === u.id}
                      onChange={() => handleToggleActive(u.id)}
                      ariaLabel={`Toggle status for ${u.name}`}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
