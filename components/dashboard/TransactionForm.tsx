"use client";

import React, { useState, useEffect } from 'react';
import { chapaService } from '../../services/chapaService';
import { mockApi } from '../../services/mockApi';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

interface TransactionFormProps {
  userEmail: string;
  userName: string;
  onTransactionCreated: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  userEmail,
  userName,
  onTransactionCreated,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [amount, setAmount] = useState('1500');
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  useEffect(() => {
    const parts = userName.split(' ');
    setFirstName(parts[0] || '');
    setLastName(parts.slice(1).join(' ') || '');
  }, [userName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast({ type: null, message: '' });

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setToast({ type: 'error', message: 'Please enter a valid payment amount.' });
      setLoading(false);
      return;
    }

    if (!firstName || !lastName) {
      setToast({ type: 'error', message: 'First and Last name are required.' });
      setLoading(false);
      return;
    }

    const cleanUserPrefix = firstName.toLowerCase().replace(/[^a-z]/g, '');
    const txRef = `tx-${cleanUserPrefix}-${Date.now()}`;

    try {
      const response = await chapaService.initializeTransaction({
        amount: parsedAmount,
        email: userEmail,
        first_name: firstName,
        last_name: lastName,
        tx_ref: txRef,
      });

      if (!response.success || !response.data?.checkout_url) {
        throw new Error(response.error || 'Failed to retrieve checkout URL');
      }

      await mockApi.addTransaction({
        userEmail,
        amount: parsedAmount,
        currency: 'ETB',
        status: 'pending',
        date: new Date().toISOString(),
        tx_ref: txRef,
      });

      onTransactionCreated();

      if (response.data._simulation) {
        setToast({
          type: 'success',
          message: `Transaction initialized. Reference: "${txRef}". Checkout is simulated — use this reference in the Verify panel to confirm status.`,
        });
      } else {
        window.open(response.data.checkout_url, '_blank');
        setToast({
          type: 'success',
          message: `Checkout initialized! Reference: "${txRef}". Complete payment in the new tab, then verify status below.`,
        });
      }

    } catch (err: any) {
      setToast({
        type: 'error',
        message: err.message || 'An error occurred while connecting to the Chapa gateway.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Initialize Checkout</CardTitle>
        <CardDescription>
          Request a unique payment URL from Chapa to initiate a secure checkout session.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {toast.type && (
          <div
            className={`mb-5 p-4 rounded-lg text-sm border transition-all duration-300 ${toast.type === 'success'
                ? 'bg-chapa-green/10 text-foreground border-chapa-green/20 dark:bg-chapa-green/25 dark:border-chapa-green/30'
                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
              }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'success' ? (
                <svg
                  className="h-5 w-5 text-chapa-green shrink-0 mt-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-500 shrink-0 mt-0.5"
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
              )}
              <p className="leading-5">{toast.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="first_name" className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
                Payer First Name
              </label>
              <input
                id="first_name"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full text-sm p-2 rounded-lg border border-chapa-border-light dark:border-chapa-border-dark bg-transparent text-foreground focus-visible:outline-2 focus-visible:outline-chapa-green"
                placeholder="Abebe"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="last_name" className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
                Payer Last Name
              </label>
              <input
                id="last_name"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full text-sm p-2 rounded-lg border border-chapa-border-light dark:border-chapa-border-dark bg-transparent text-foreground focus-visible:outline-2 focus-visible:outline-chapa-green"
                placeholder="Kebede"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
                Merchant Email Address
              </label>
              <input
                id="email"
                type="email"
                readOnly
                value={userEmail}
                className="w-full text-sm p-2 rounded-lg border border-chapa-border-light dark:border-chapa-border-dark bg-zinc-100 dark:bg-zinc-800/40 text-chapa-slate dark:text-zinc-400 cursor-not-allowed outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="amount" className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
                Checkout Amount (ETB)
              </label>
              <div className="relative">
                <input
                  id="amount"
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-sm p-2 rounded-lg border border-chapa-border-light dark:border-chapa-border-dark bg-transparent text-foreground focus-visible:outline-2 focus-visible:outline-chapa-green font-mono font-bold"
                  placeholder="1000"
                />
                <span className="absolute right-3 top-2 text-xs font-semibold text-chapa-slate dark:text-zinc-500">
                  ETB
                </span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            variant="primary"
            className="w-full mt-2"
          >
            Launch Checkout Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
