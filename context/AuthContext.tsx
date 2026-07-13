"use client";

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppUser } from '../types';
import { mockUsers } from '../services/mockData';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('chapa_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('chapa_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Lookup user in mock database
    const matchedUser = mockUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!matchedUser) {
      return {
        success: false,
        error: 'Invalid account email. Use a demo account from the quick-start list.',
      };
    }

    if (!matchedUser.active) {
      return {
        success: false,
        error: 'This account has been suspended. Contact platform security support.',
      };
    }

    setUser(matchedUser);
    localStorage.setItem('chapa_user', JSON.stringify(matchedUser));

    const role = matchedUser.role;
    if (role === 'super_admin') {
      router.push('/dashboard/super-admin');
    } else {
      router.push(`/dashboard/${role}`);
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chapa_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
