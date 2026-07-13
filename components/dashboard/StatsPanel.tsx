"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { AppUser, Transaction } from '../../types';
import { mockApi } from '../../services/mockApi';
import { Card, CardContent } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

interface StatsPanelProps {
  titlePrefix?: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ titlePrefix = 'System-wide' }) => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [usersData, txsData] = await Promise.all([
          mockApi.getUsers(),
          mockApi.getTransactions(),
        ]);
        setUsers(usersData);
        setTransactions(txsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const stats = useMemo(() => {
    const merchants = users.filter((u) => u.role === 'user');
    const totalMerchantsCount = merchants.length;
    const activeMerchantsCount = merchants.filter((u) => u.active).length;

    const successfulTxs = transactions.filter((t) => t.status === 'success');
    const totalPaymentsVolume = successfulTxs.reduce((sum, tx) => sum + tx.amount, 0);
    const settledCount = successfulTxs.length;

    return {
      totalMerchants: totalMerchantsCount,
      activeMerchants: activeMerchantsCount,
      totalVolume: totalPaymentsVolume,
      settledTxs: settledCount,
    };
  }, [users, transactions]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Skeleton className="h-28 w-full col-span-1" />
        <Skeleton className="h-28 w-full col-span-1" />
        <Skeleton className="h-28 w-full md:col-span-2" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <h3 className="text-xs font-bold uppercase tracking-wider text-chapa-slate dark:text-zinc-500">
        {titlePrefix} Live Analytics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full overflow-hidden">
        
        <Card className="col-span-1">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <p className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
                Total Merchants
              </p>
              <h4 className="text-4xl font-extrabold font-mono tracking-tight text-foreground mt-2">
                {stats.totalMerchants}
              </h4>
            </div>
            <p className="text-[10px] text-chapa-slate dark:text-zinc-500 mt-4">
              Registered business terminals
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <p className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
                Active Merchants
              </p>
              <h4 className="text-4xl font-extrabold font-mono tracking-tight text-chapa-green mt-2">
                {stats.activeMerchants}
              </h4>
            </div>
            <p className="text-[10px] text-chapa-slate dark:text-zinc-500 mt-4">
              {stats.totalMerchants > 0
                ? `${((stats.activeMerchants / stats.totalMerchants) * 100).toFixed(0)}% authorization rate`
                : '0% authorization rate'}
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 border-l-4 border-l-chapa-green relative overflow-hidden bg-gradient-to-r from-white to-zinc-50/50 dark:from-chapa-dark/40 dark:to-chapa-dark/10">
          <CardContent className="p-6 flex flex-col justify-between h-full z-10">
            <div>
              <div className="flex justify-between items-start gap-2">
                <p className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
                  Total Settled Payments Volume
                </p>
                <span className="text-[9px] uppercase font-bold tracking-widest bg-chapa-green/10 text-chapa-green px-2 py-0.5 rounded dark:bg-chapa-green/20 shrink-0">
                  Core Revenue Metric
                </span>
              </div>
              
              <h4 className="text-3xl lg:text-5xl font-black font-mono tracking-tighter text-foreground mt-2 tabular-nums truncate">
                {stats.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                <span className="text-sm font-semibold text-chapa-green font-sans ml-2">ETB</span>
              </h4>
            </div>

            <div className="flex justify-between items-center mt-4 pt-2 border-t border-dashed border-chapa-border-light dark:border-chapa-border-dark text-[10px] text-chapa-slate dark:text-zinc-400">
              <span>Aggregated across {stats.settledTxs} successful deposits</span>
              <span className="font-semibold text-foreground font-mono">Simulated gateway feed</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
