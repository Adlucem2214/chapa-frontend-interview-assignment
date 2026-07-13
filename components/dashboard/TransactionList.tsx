"use client";

import React from 'react';
import { Transaction } from '../../types';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  userEmail?: string;
  className?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  userEmail,
  className = '',
}) => {
  const filteredTxs = React.useMemo(() => {
    if (userEmail) {
      return transactions.filter((tx) => tx.userEmail === userEmail);
    }
    return transactions;
  }, [transactions, userEmail]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'pending':
        return 'pending';
      case 'failed':
        return 'failed';
      default:
        return 'neutral';
    }
  };

  const renderSkeletons = () => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <tr key={`skeleton-${idx}`} className="border-b border-chapa-border-light dark:border-chapa-border-dark">
        <td className="p-4"><Skeleton className="h-4 w-28" /></td>
        {!userEmail && <td className="p-4"><Skeleton className="h-4 w-36" /></td>}
        <td className="p-4"><Skeleton className="h-4 w-20" /></td>
        <td className="p-4"><Skeleton className="h-5 w-16" /></td>
        <td className="p-4"><Skeleton className="h-4 w-32" /></td>
      </tr>
    ));
  };

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-chapa-border-light dark:border-chapa-border-dark bg-white dark:bg-chapa-dark/40 shadow-sm ${className}`}>
      <div className="px-6 py-4 border-b border-chapa-border-light dark:border-chapa-border-dark flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground text-base">Transaction Ledger</h3>
          <p className="text-xs text-chapa-slate dark:text-zinc-500">
            {userEmail ? 'Your payment and deposit activities' : 'Global system-wide settlement activity'}
          </p>
        </div>
        <Badge variant="neutral">
          {isLoading ? 'Loading...' : `${filteredTxs.length} Records`}
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-chapa-border-light dark:border-chapa-border-dark bg-zinc-50 dark:bg-zinc-800/10 text-xs font-semibold uppercase tracking-wider text-chapa-slate dark:text-zinc-500">
              <th className="p-4">Reference</th>
              {!userEmail && <th className="p-4">Merchant/Email</th>}
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Settlement Date</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-chapa-border-light dark:divide-chapa-border-dark text-sm">
            {isLoading ? (
              renderSkeletons()
            ) : filteredTxs.length === 0 ? (
              <tr>
                <td colSpan={userEmail ? 4 : 5} className="p-8 text-center text-chapa-slate dark:text-zinc-500">
                  No transaction records found. Use the Launch Checkout button to initialize a new payment.
                </td>
              </tr>
            ) : (
              filteredTxs.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                >
                  <td className="p-4 font-medium font-mono text-xs text-foreground tracking-tight">
                    {tx.tx_ref}
                  </td>
                  {!userEmail && (
                    <td className="p-4 text-chapa-slate dark:text-zinc-300">
                      {tx.userEmail}
                    </td>
                  )}
                  <td className="p-4 font-bold font-mono tracking-tight text-foreground">
                    {tx.amount.toLocaleString()} <span className="text-xs font-normal text-chapa-slate">{tx.currency}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(tx.status)}>
                        {tx.status.toUpperCase()}
                      </Badge>
                      {tx.status === 'pending' && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chapa-green opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-chapa-green"></span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-chapa-slate dark:text-zinc-400 text-xs">
                    {formatDate(tx.date)}
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
