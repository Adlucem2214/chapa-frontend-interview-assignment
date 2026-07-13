"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { AppUser, Transaction } from '../../types';
import { mockApi } from '../../services/mockApi';
import { Skeleton } from '../ui/Skeleton';

interface AggregatedSummary {
  name: string;
  email: string;
  count: number;
  totalAmount: number;
  percentage: number;
}

export const UserPaymentsSummary: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, txsData] = await Promise.all([
          mockApi.getUsers(),
          mockApi.getTransactions(),
        ]);
        setUsers(usersData);
        setTransactions(txsData);
      } catch (err) {
        console.error('Failed to load data for summary', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const summaryData = useMemo<AggregatedSummary[]>(() => {
    if (users.length === 0 || transactions.length === 0) return [];

    const successfulTxs = transactions.filter(t => t.status === 'success');
    const totalVolume = successfulTxs.reduce((sum, t) => sum + t.amount, 0);
    const grouped = new Map<string, { amount: number; count: number }>();
    
    successfulTxs.forEach((tx) => {
      const current = grouped.get(tx.userEmail) || { amount: 0, count: 0 };
      grouped.set(tx.userEmail, {
        amount: current.amount + tx.amount,
        count: current.count + 1,
      });
    });

    const summaryList: AggregatedSummary[] = users
      .filter((u) => u.role === 'user')
      .map((u) => {
        const stats = grouped.get(u.email) || { amount: 0, count: 0 };
        return {
          name: u.name,
          email: u.email,
          count: stats.count,
          totalAmount: stats.amount,
          percentage: totalVolume > 0 ? (stats.amount / totalVolume) * 100 : 0,
        };
      });

    return summaryList.sort((a, b) => b.totalAmount - a.totalAmount);
  }, [users, transactions]);

  if (loading) {
    return (
      <div className="w-full space-y-3 p-6 border border-chapa-border-light dark:border-chapa-border-dark rounded-xl bg-white dark:bg-chapa-dark/40 shadow-sm">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-chapa-border-light dark:border-chapa-border-dark bg-white dark:bg-chapa-dark/40 shadow-sm">
      <div className="px-6 py-4 border-b border-chapa-border-light dark:border-chapa-border-dark">
        <h3 className="font-semibold text-foreground text-base">Settlement Volumes by Merchant</h3>
        <p className="text-xs text-chapa-slate dark:text-zinc-500">
          Ranked lists of users by completed volume turnover
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-chapa-border-light dark:border-chapa-border-dark bg-zinc-50 dark:bg-zinc-800/10 text-xs font-semibold uppercase tracking-wider text-chapa-slate dark:text-zinc-500">
              <th className="p-4">Merchant Name</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-center">Settled Tx Count</th>
              <th className="p-4 text-right">Total Settled (ETB)</th>
              <th className="p-4 text-right">Volume Share</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-chapa-border-light dark:divide-chapa-border-dark text-sm">
            {summaryData.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-chapa-slate dark:text-zinc-500">
                  No merchant transactions logged in this system.
                </td>
              </tr>
            ) : (
              summaryData.map((row) => (
                <tr key={row.email} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 font-medium text-foreground">
                    {row.name}
                  </td>
                  <td className="p-4 text-chapa-slate dark:text-zinc-300">
                    {row.email}
                  </td>
                  <td className="p-4 text-center text-foreground font-mono">
                    {row.count}
                  </td>
                  <td className="p-4 text-right font-bold font-mono text-foreground tracking-tight">
                    {row.totalAmount.toLocaleString()} <span className="text-xs font-normal text-chapa-slate">ETB</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-xs font-mono font-semibold text-foreground">
                        {row.percentage.toFixed(1)}%
                      </span>
                      <div className="w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden hidden sm:block border border-chapa-border-light dark:border-chapa-border-dark">
                        <div
                          className="bg-chapa-green h-full rounded-full"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                    </div>
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
