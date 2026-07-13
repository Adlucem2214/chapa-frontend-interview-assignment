"use client";

import React, { useMemo } from 'react';
import { Transaction } from '../../types';

interface WalletCardProps {
  transactions: Transaction[];
  userEmail: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({ transactions, userEmail }) => {
  const walletStats = useMemo(() => {
    const BASE_BALANCE = 25000;
    const userTx = transactions.filter(t => t.userEmail === userEmail && t.status === 'success');
    const transactionSum = userTx.reduce((acc, tx) => acc + tx.amount, 0);
    return {
      balance: BASE_BALANCE + transactionSum,
      txCount: userTx.length
    };
  }, [transactions, userEmail]);

  return (
    <div className="relative overflow-hidden py-8 px-6 rounded-2xl border border-chapa-border-light dark:border-chapa-border-dark bg-white dark:bg-chapa-dark/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="z-10 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-chapa-slate dark:text-zinc-500">
            Available Ledger Balance
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-chapa-green animate-pulse" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-5xl md:text-6xl font-bold font-mono tracking-tighter tabular-nums text-foreground">
            {walletStats.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xl md:text-2xl font-semibold text-chapa-green font-sans">ETB</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-chapa-slate dark:text-zinc-400">
          <span className="inline-flex items-center gap-0.5 bg-chapa-green/10 text-chapa-green px-2 py-0.5 rounded font-medium dark:bg-chapa-green/20">
            ▲ 14.8%
          </span>
          <span>Computed from {walletStats.txCount} successful deposits + base ledger reserves.</span>
        </div>
      </div>
    </div>
  );
};
