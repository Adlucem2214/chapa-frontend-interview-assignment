"use client";

import React, { useState, useEffect } from 'react';
import { RoleGuard } from '../../../components/layout/RoleGuard';
import { StatsPanel } from '../../../components/dashboard/StatsPanel';
import { UserTable } from '../../../components/dashboard/UserTable';
import { UserPaymentsSummary } from '../../../components/dashboard/UserPaymentsSummary';
import { BankList } from '../../../components/dashboard/BankList';
import { AdminForm, AddAdminModal } from '../../../components/dashboard/AdminForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { chapaService } from '../../../services/chapaService';
import { mockApi } from '../../../services/mockApi';
import { AppUser } from '../../../types';

export default function SuperAdminDashboard() {
  const [admins, setAdmins] = useState<AppUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const [transferRef, setTransferRef] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const loadAdmins = async () => {
    try {
      const data = await mockApi.getUsers();
      setAdmins(data.filter((u) => u.role === 'admin'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleAddAdminSubmit = async (name: string, email: string) => {
    const newAdmin = await mockApi.addAdmin(name, email);
    setAdmins((prev) => [...prev, newAdmin]);
    setToast({ type: 'success', message: `Administrator ${newAdmin.name} registered successfully.` });
  };

  const handleRemoveAdmin = async (id: string) => {
    setToast({ type: null, message: '' });
    try {
      await mockApi.removeAdmin(id);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      setToast({ type: 'success', message: 'Administrator account deleted successfully.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to remove admin.' });
    }
  };

  const handleVerifyTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferRef.trim()) return;

    setLoadingVerify(true);
    setVerifyResult(null);
    setVerifyError(null);

    try {
      const res = await chapaService.verifyTransfer(transferRef.trim());
      if (res.success && res.data) {
        setVerifyResult(res.data);
      } else {
        throw new Error(res.error || 'Verification returned an invalid response.');
      }
    } catch (err: any) {
      setVerifyError(err.message || 'Verification connection failed.');
    } finally {
      setLoadingVerify(false);
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

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-chapa-border-light dark:border-chapa-border-dark pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Super Admin Console</h1>
            <p className="text-xs text-chapa-slate dark:text-zinc-500">System-wide operational controls, administrator directories, and settlement verification</p>
          </div>
          <Button
            onClick={() => setIsAddAdminOpen(true)}
            variant="primary"
            size="sm"
            className="font-semibold shadow-sm"
          >
            Add Admin
          </Button>
        </div>

        <section id="stats" className="w-full">
          <StatsPanel titlePrefix="Organization" />
        </section>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <section id="users" className="lg:col-span-2 w-full flex">
            <UserTable className="h-full" />
          </section>
          <section id="banks" className="lg:col-span-1 w-full flex">
            <BankList className="h-full" />
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mt-2">
          <section id="admins" className="lg:col-span-2 w-full flex">
            <AdminForm
              admins={admins}
              loading={loadingAdmins}
              onRemoveAdmin={handleRemoveAdmin}
              toast={toast}
              className="h-full"
            />
          </section>

          <section id="verify-transfer" className="lg:col-span-1 w-full flex">
            <Card className="w-full h-full flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle>Verify Settlement Transfer</CardTitle>
                  <CardDescription>
                    Confirm outgoing bank transfer progress by querying the transfer-verify route.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <form onSubmit={handleVerifyTransfer} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Enter transfer reference (e.g. tr-cbe-001)..."
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      className="flex-1 text-xs p-2 rounded-lg border border-chapa-border-light dark:border-chapa-border-dark bg-transparent text-foreground focus-visible:outline-2 focus-visible:outline-chapa-green font-mono"
                    />
                    <Button
                      type="submit"
                      isLoading={loadingVerify}
                      variant="outline"
                      className="text-xs h-9 shrink-0"
                    >
                      Verify
                    </Button>
                  </form>

                  {verifyError && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 flex items-center gap-1.5">
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
                    <div className="p-4 border border-chapa-border-light dark:border-chapa-border-dark rounded-lg bg-zinc-50/50 dark:bg-zinc-800/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
                          Transfer Status:
                        </span>
                        <Badge variant={getVerifyBadgeVariant(verifyResult.status)}>
                          {(verifyResult.status || 'unknown').toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-chapa-slate dark:text-zinc-400">Reference:</span>
                        <span className="font-mono font-semibold">{verifyResult.transfer_reference}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-chapa-slate dark:text-zinc-400">Amount:</span>
                        <span className="font-mono font-bold text-foreground">
                          {verifyResult.amount?.toLocaleString()} {verifyResult.currency}
                        </span>
                      </div>

                      <div className="flex justify-between items-start text-xs gap-4">
                        <span className="text-chapa-slate dark:text-zinc-400 shrink-0">Destination:</span>
                        <span className="text-right font-medium text-foreground">
                          {verifyResult.bank_name} <br />
                          <span className="text-[10px] text-chapa-slate font-mono">Acct: {verifyResult.account_number}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>


            </Card>
          </section>
        </div>

        <section id="payments" className="w-full mt-2">
          <UserPaymentsSummary />
        </section>

        <AddAdminModal
          isOpen={isAddAdminOpen}
          onClose={() => setIsAddAdminOpen(false)}
          onAddAdmin={handleAddAdminSubmit}
        />
      </div>
    </RoleGuard>
  );
}
