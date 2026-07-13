import { AppUser, Transaction } from '../types';
import { mockUsers, mockTransactions } from './mockData';

const getLatency = () => Math.floor(Math.random() * (800 - 300 + 1)) + 300;

export const mockApi = {
  getUsers(): Promise<AppUser[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockUsers]);
      }, getLatency());
    });
  },

  getTransactions(): Promise<Transaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockTransactions]);
      }, getLatency());
    });
  },

  toggleUserActive(userId: string): Promise<AppUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => u.id === userId);
        if (!user) {
          reject(new Error(`User with ID ${userId} not found`));
          return;
        }
        user.active = !user.active;
        resolve({ ...user });
      }, getLatency());
    });
  },

  addTransaction(newTx: Omit<Transaction, 'id'>): Promise<Transaction> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const createdTx: Transaction = {
          ...newTx,
          id: `tx_${mockTransactions.length + 1}`,
        };
        mockTransactions.unshift(createdTx);
        resolve(createdTx);
      }, getLatency());
    });
  },

  addAdmin(name: string, email: string): Promise<AppUser> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAdmin: AppUser = {
          id: `usr_${mockUsers.length + 1}`,
          name,
          email,
          role: 'admin',
          active: true,
        };
        mockUsers.push(newAdmin);
        resolve(newAdmin);
      }, getLatency());
    });
  },

  removeAdmin(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex((u) => u.id === userId && u.role === 'admin');
        if (index === -1) {
          reject(new Error(`Admin user with ID ${userId} not found`));
          return;
        }
        mockUsers.splice(index, 1);
        resolve(userId);
      }, getLatency());
    });
  },
};
