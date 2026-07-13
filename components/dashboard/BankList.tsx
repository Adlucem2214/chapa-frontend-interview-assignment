"use client";

import React, { useState, useEffect } from 'react';
import { Bank } from '../../types';
import { chapaService } from '../../services/chapaService';
import { Skeleton } from '../ui/Skeleton';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface BankListProps {
  className?: string;
}

export const BankList: React.FC<BankListProps> = ({ className = '' }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBanks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chapaService.fetchBanks();
      if (response.success && response.data) {
        setBanks(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch bank data.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading banks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const filteredBanks = React.useMemo(() => {
    return banks.filter(
      (b) =>
        (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.acronym || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [banks, searchQuery]);

  const renderSkeletons = () => {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={`bank-skel-${idx}`} className="p-3 border border-chapa-border-light dark:border-chapa-border-dark rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-5 w-5 rounded-md" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`w-full p-6 border border-chapa-border-light dark:border-chapa-border-dark rounded-xl bg-white dark:bg-chapa-dark/40 shadow-sm flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="font-semibold text-foreground text-base">Supported Financial Institutions</h3>
          <p className="text-xs text-chapa-slate dark:text-zinc-500">
            Real-time commercial bank listing for settlement integrations
          </p>
        </div>
        <Badge variant="neutral" className="rounded-md shrink-0">
          {loading ? 'Querying...' : `${banks.length} Banks`}
        </Badge>
      </div>

      {/* SEARCH BAR (Disabled if loading or error) */}
      <div className="relative">
        <input
          type="text"
          placeholder="Filter banks by name or shortcode (e.g. CBE, Dashen)..."
          disabled={loading || !!error}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-sm p-2.5 pl-10 rounded-lg border border-chapa-border-light dark:border-chapa-border-dark bg-transparent text-foreground focus-visible:outline-2 focus-visible:outline-chapa-green disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <svg
          className="absolute left-3.5 top-3.5 h-4 w-4 text-chapa-slate"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadBanks} className="shrink-0 h-8">
            Retry Loading
          </Button>
        </div>
      ) : loading ? (
        renderSkeletons()
      ) : filteredBanks.length === 0 ? (
        <div className="text-center py-8 text-chapa-slate dark:text-zinc-500 text-sm">
          No bank matches your filter "{searchQuery}". Try a different name.
        </div>
      ) : (
        <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto pr-1 max-h-[340px]">
          {filteredBanks.map((bank) => (
            <div
              key={bank.id}
              className="p-3 border border-chapa-border-light dark:border-chapa-border-dark rounded-lg flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/10 hover:border-chapa-green/40 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all"
            >
              <div className="min-w-0 flex items-center gap-3">
                <svg className="h-5 w-5 text-chapa-slate dark:text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate" title={bank.name}>
                    {bank.name}
                  </h4>
                  <p className="text-xs text-chapa-slate dark:text-zinc-500 font-mono mt-0.5">
                    ID: {bank.id}
                  </p>
                </div>
              </div>
              
              {(bank.code || bank.acronym) && (
                <Badge variant="success" className="uppercase font-mono text-[10px] shrink-0">
                  {bank.code || bank.acronym}
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
