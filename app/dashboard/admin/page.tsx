"use client"; // REQUIRED: Aggregates client-side admin components

import React from 'react';
import { RoleGuard } from '../../../components/layout/RoleGuard';
import { StatsPanel } from '../../../components/dashboard/StatsPanel';
import { UserTable } from '../../../components/dashboard/UserTable';
import { UserPaymentsSummary } from '../../../components/dashboard/UserPaymentsSummary';
import { BankList } from '../../../components/dashboard/BankList';

export default function AdminDashboard() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      

      <section id="stats" className="w-full">
        <StatsPanel titlePrefix="Settlements" />
      </section>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <section id="users" className="lg:col-span-2 w-full flex">
          <UserTable className="h-full" />
        </section>
        <section id="banks" className="lg:col-span-1 w-full flex">
          <BankList className="h-full" />
        </section>
      </div>

      <section id="payments" className="w-full mt-8">
        <UserPaymentsSummary />
      </section>

    </RoleGuard>
  );
}
