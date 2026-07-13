"use client";

import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'user';

  const navItems = {
    user: [
      {
        label: 'My Wallet',
        href: '#wallet',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <rect width="18" height="12" x="3" y="6" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18" />
          </svg>
        )
      },
      {
        label: 'Make Payment',
        href: '#payment',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L18 12M18 12L13 7M18 12L13 17" />
          </svg>
        )
      },
      {
        label: 'Transaction History',
        href: '#history',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      },
      {
        label: 'Verify Transaction',
        href: '#verify',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        )
      },
    ],
    admin: [
      {
        label: 'Analytics Panel',
        href: '#stats',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 18.375v-5.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-9.75zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        )
      },
      {
        label: 'User Directory',
        href: '#users',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.978 11.978 0 0112 20c-1.258 0-2.45-.18-3.578-.512v-.109A11.978 11.978 0 0112 19c-.382 0-.756-.024-1.122-.071M12 19c-1.258 0-2.45-.18-3.578-.512V18a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0114.25 18v.488M12 18.75v-2.25M9 8.25a3 3 0 116 0 3 3 0 01-6 0z" />
          </svg>
        )
      },
      {
        label: 'Payments Summary',
        href: '#payments',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <rect width="18" height="12" x="3" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3m12 0h3" />
          </svg>
        )
      },
      {
        label: 'Bank Directory',
        href: '#banks',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V10m0 11H7.5m4.5 0H16.5m-9-11v11m0-11H5.25A2.25 2.25 0 013 7.75v-.5A2.25 2.25 0 015.25 5h13.5A2.25 2.25 0 0121 7.25v.5a2.25 2.25 0 01-2.25 2.75H18.75m-3-11v11m-12-11V5a2 2 0 012-2h12a2 2 0 012 2v2" />
          </svg>
        )
      },
    ],
    super_admin: [
      {
        label: 'Analytics Panel',
        href: '#stats',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 18.375v-5.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-9.75zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        )
      },
      {
        label: 'User Directory',
        href: '#users',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.978 11.978 0 0112 20c-1.258 0-2.45-.18-3.578-.512v-.109A11.978 11.978 0 0112 19c-.382 0-.756-.024-1.122-.071M12 19c-1.258 0-2.45-.18-3.578-.512V18a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0114.25 18v.488M12 18.75v-2.25M9 8.25a3 3 0 116 0 3 3 0 01-6 0z" />
          </svg>
        )
      },
      {
        label: 'Payments Summary',
        href: '#payments',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <rect width="18" height="12" x="3" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3m12 0h3" />
          </svg>
        )
      },
      {
        label: 'Bank Directory',
        href: '#banks',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V10m0 11H7.5m4.5 0H16.5m-9-11v11m0-11H5.25A2.25 2.25 0 013 7.75v-.5A2.25 2.25 0 015.25 5h13.5A2.25 2.25 0 0121 7.25v.5a2.25 2.25 0 01-2.25 2.75H18.75m-3-11v11m-12-11V5a2 2 0 012-2h12a2 2 0 012 2v2" />
          </svg>
        )
      },
      {
        label: 'Manage Admins',
        href: '#admins',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-5.7 7.5-3v11.25C19.5 17.587 14.862 21.05 12 21.75c-2.862-.7-7.5-4.163-7.5-11.25V4.05L12 1.05Z" />
          </svg>
        )
      },
      {
        label: 'Verify Transfer',
        href: '#verify-transfer',
        icon: (
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        )
      },
    ],
  };

  const currentItems = navItems[role] || navItems.user;

  const getRoleLabel = (r: string) => {
    if (r === 'super_admin') return 'Super Admin';
    return r.charAt(0).toUpperCase() + r.slice(1);
  };

  return (
    <aside className="w-64 border-r border-chapa-border-light dark:border-chapa-border-dark flex flex-col bg-white dark:bg-chapa-dark/50 shrink-0 h-screen sticky top-0">
      <div className="h-16 flex items-center justify-between px-6 border-b border-chapa-border-light dark:border-chapa-border-dark">
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-[3px] h-6 w-5" aria-hidden="true">
            <div className="w-[3px] h-2 bg-chapa-green ledger-line rounded-full" />
            <div className="w-[3px] h-5 bg-chapa-green ledger-line rounded-full" />
            <div className="w-[3px] h-3 bg-chapa-green ledger-line rounded-full" />
            <div className="w-[3px] h-6 bg-chapa-green ledger-line rounded-full" />
          </div>
          <span className="font-bold tracking-tight text-lg text-foreground">
            Chapa <span className="text-chapa-green font-normal">Dash</span>
          </span>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-chapa-border-light dark:border-chapa-border-dark bg-zinc-50/50 dark:bg-zinc-800/10">
        <p className="text-xs text-chapa-slate dark:text-zinc-500 uppercase font-semibold tracking-wider">
          Access Level
        </p>
        <h4 className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-chapa-green" />
          {getRoleLabel(role)}
        </h4>
        <p className="text-xs text-chapa-slate dark:text-zinc-400 mt-0.5 truncate">
          {user?.email}
        </p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {currentItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-chapa-slate hover:text-foreground dark:text-zinc-400 dark:hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-chapa-green transition-all"
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-chapa-border-light dark:border-chapa-border-dark text-center">
        <p className="text-[10px] text-chapa-slate dark:text-zinc-500">
          Chapa PSP © 2026
        </p>
      </div>
    </aside>
  );
};
