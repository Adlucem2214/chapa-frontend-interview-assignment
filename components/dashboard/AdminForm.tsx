"use client";

import React, { useState } from 'react';
import { AppUser } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';

interface AdminFormProps {
  admins: AppUser[];
  loading: boolean;
  onRemoveAdmin: (id: string) => void;
  toast: { type: 'success' | 'error' | null; message: string };
  className?: string;
}

export const AdminForm: React.FC<AdminFormProps> = ({
  admins,
  loading,
  onRemoveAdmin,
  toast,
  className = '',
}) => {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Clearance Directory</CardTitle>
          <CardDescription>Accounts granted administrator privileges.</CardDescription>
        </div>
        <Badge variant="neutral">{loading ? '...' : `${admins.length} Admins`}</Badge>
      </CardHeader>
      <CardContent>
        {toast.type && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm border flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-chapa-green/10 text-foreground border-chapa-green/20 dark:bg-chapa-green/20'
                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400'
            }`}
          >
            {toast.type === 'success' ? (
              <svg
                className="h-5 w-5 text-chapa-green shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-red-500 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <p className="flex-1">{toast.message}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : admins.length === 0 ? (
          <p className="text-center py-6 text-chapa-slate dark:text-zinc-500 text-sm">
            No secondary administrators are registered yet. Use the "Add Admin" button to grant clearance.
          </p>
        ) : (
          <div className="divide-y divide-chapa-border-light dark:divide-chapa-border-dark max-h-96 overflow-y-auto pr-1">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    {admin.name}
                    <span className="text-[10px] uppercase bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-mono font-semibold">
                      Admin
                    </span>
                  </h4>
                  <p className="text-xs text-chapa-slate dark:text-zinc-400 mt-0.5 font-mono">
                    {admin.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveAdmin(admin.id)}
                  className="text-xs h-8 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-950/20"
                  aria-label={`Remove clearance for ${admin.name}`}
                >
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAdmin: (name: string, email: string) => Promise<void>;
}

export const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  onAddAdmin,
}) => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      setError('Name and email are required.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await onAddAdmin(formName, formEmail);
      setFormName('');
      setFormEmail('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register administrator.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
      <div
        className="w-full max-w-md border rounded-2xl p-6 shadow-xl relative animate-scale-up"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-chapa-slate hover:text-foreground cursor-pointer rounded-full transition-colors flex items-center justify-center"
          aria-label="Close form"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Register Administrator
        </h2>
        <p className="text-xs text-chapa-slate dark:text-zinc-400 mt-1.5">
          Grant standard admin clearance to system accounts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {error && (
            <div className="p-3 rounded-lg text-xs bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin_name" className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
              Full Name
            </label>
            <input
              id="admin_name"
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full text-sm p-2 rounded-lg border border-chapa-border-light dark:border-chapa-border-dark bg-transparent text-foreground focus-visible:outline-2 focus-visible:outline-chapa-green outline-none"
              placeholder="Genet Kebede"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin_email" className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
              Email Address
            </label>
            <input
              id="admin_email"
              type="email"
              required
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="w-full text-sm p-2 rounded-lg border border-chapa-border-light dark:border-chapa-border-dark bg-transparent text-foreground focus-visible:outline-2 focus-visible:outline-chapa-green outline-none"
              placeholder="genet@chapa.co"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              variant="primary"
              className="text-xs px-4"
            >
              Grant Clearance
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
