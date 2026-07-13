"use client"; // REQUIRED: Combines multiple interactive user dashboard panels

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { RoleGuard } from '../../../components/layout/RoleGuard';
import { WalletCard } from '../../../components/dashboard/WalletCard';
import { TransactionList } from '../../../components/dashboard/TransactionList';
import { TransactionForm } from '../../../components/dashboard/TransactionForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Transaction } from '../../../types';
import { mockApi } from '../../../services/mockApi';
import { chapaService } from '../../../services/chapaService';


export default function UserDashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTxs, setLoadingTxs] = useState(true);


  const [verifyRef, setVerifyRef] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isInitializeOpen, setIsInitializeOpen] = useState(false);


  const loadTransactions = useCallback(async () => {
    setLoadingTxs(true);
    try {
      const data = await mockApi.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions', err);
    } finally {
      setLoadingTxs(false);
    }
  }, []);


  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleVerifyTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyRef.trim()) return;

    setVerifyLoading(true);
    setVerifyResult(null);
    setVerifyError(null);

    try {
      const res = await chapaService.verifyTransaction(verifyRef.trim());
      if (res.success && res.data) {
        setVerifyResult(res.data);
        

        const verifiedStatus = res.data.status;
        setTransactions((prevList) =>
          prevList.map((tx) =>
            tx.tx_ref === verifyRef.trim() ? { ...tx, status: verifiedStatus } : tx
          )
        );
      } else {
        throw new Error(res.error || 'Verification returned an invalid response.');
      }
    } catch (err: any) {
      setVerifyError(err.message || 'Verification connection failed.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const getVerifyBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
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

  if (!user) return null;

  return (
    <RoleGuard allowedRoles={['user']}>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-chapa-border-light dark:border-chapa-border-dark pb-5 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Merchant Payment Console</h1>
          <p className="text-xs text-chapa-slate dark:text-zinc-500">Initialize payments, inspect checkout sessions, and review transaction ledgers</p>
        </div>
        <Button
          onClick={() => setIsInitializeOpen(true)}
          variant="primary"
          size="sm"
          className="font-semibold shadow-sm text-xs px-4 h-9 shrink-0"
        >
          Launch Checkout
        </Button>
      </div>

      <section id="wallet" className="w-full mb-8">
        <WalletCard transactions={transactions} userEmail={user.email} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        <section id="verify" className="lg:col-span-1 w-full flex">
          <Card className="w-full h-full flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle>Verify Transaction Status</CardTitle>
                <CardDescription>
                  Confirm payment completion by querying the Chapa verification endpoint.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <form onSubmit={handleVerifyTransaction} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter tx_ref reference..."
                    value={verifyRef}
                    onChange={(e) => setVerifyRef(e.target.value)}
                    className="flex-1 text-xs p-2 rounded-lg border border-chapa-border-light dark:border-chapa-border-dark bg-transparent text-foreground focus-visible:outline-2 focus-visible:outline-chapa-green font-mono"
                  />
                  <Button
                    type="submit"
                    isLoading={verifyLoading}
                    variant="outline"
                    className="text-xs h-9 shrink-0"
                  >
                    Verify
                  </Button>
                </form>

                {verifyError && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 flex items-center gap-1.5 animate-[fadeIn_0.2s_ease-out]">
                    <svg
                      className="h-4 w-4 text-red-500 dark:text-red-400 shrink-0"
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
                    <span>{verifyError}</span>
                  </div>
                )}

                {verifyResult && (
                  <div className="p-4 border border-chapa-border-light dark:border-chapa-border-dark rounded-lg bg-zinc-50/50 dark:bg-zinc-800/10 space-y-3 animate-[fadeIn_0.2s_ease-out]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
                        Verification Status:
                      </span>
                      <Badge variant={getVerifyBadgeVariant(verifyResult.status)}>
                        {(verifyResult.status || 'unknown').toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-chapa-slate dark:text-zinc-400">Reference:</span>
                      <span className="font-mono font-semibold">{verifyResult.tx_ref}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-chapa-slate dark:text-zinc-400">Amount:</span>
                      <span className="font-mono font-bold text-foreground">
                        {verifyResult.amount?.toLocaleString()} {verifyResult.currency}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </div>


          </Card>
        </section>

        <section id="history" className="lg:col-span-2 w-full flex">
          <TransactionList
            transactions={transactions}
            isLoading={loadingTxs}
            userEmail={user.email}
            className="h-full"
          />
        </section>

      </div>

      {isInitializeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-chapa-border-light dark:border-chapa-border-dark rounded-xl shadow-xl p-6 overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-chapa-border-light dark:border-chapa-border-dark pb-3 mb-5">
              <div>
                <h3 className="text-base font-bold text-foreground">Initialize Checkout Session</h3>
                <p className="text-[11px] text-chapa-slate dark:text-zinc-500">Generate a secure payment gateway redirection link</p>
              </div>
              <button
                onClick={() => setIsInitializeOpen(false)}
                className="text-chapa-slate hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5 rounded-lg transition-all"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <TransactionForm
              userEmail={user.email}
              userName={user.name}
              onTransactionCreated={() => {
                loadTransactions();
                setIsInitializeOpen(false);
              }}
            />
          </div>
        </div>
      )}

    </RoleGuard>
  );
}
