'use client';

import { formatCurrency } from '@/lib/currency';
import type { Bill } from '@/lib/types';

interface TotalsBarProps {
  bills: Bill[];
  monthTotal: number;
  sevenDayTotal: number;
  thirtyDayTotal: number;
  currency: string;
  onExport: () => void;
  onImport: () => void;
}

const TotalsBar = ({
  bills,
  monthTotal,
  sevenDayTotal,
  thirtyDayTotal,
  currency,
  onExport,
  onImport,
}: TotalsBarProps) => (
  <div className="flex flex-col gap-4 rounded-3xl bg-surface p-6 shadow-lg lg:flex-row lg:items-center lg:justify-between">
    <div>
      <h2 className="text-xl font-semibold text-accent">This month</h2>
      <p className="text-sm text-gray-300">
        Tracking {bills.length} active {bills.length === 1 ? 'bill' : 'bills'}
      </p>
    </div>
    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
      <div className="rounded-2xl bg-muted px-4 py-3">
        <p className="text-gray-400">Monthly total</p>
        <p className="text-lg font-semibold text-text">
          {formatCurrency(monthTotal, currency)}
        </p>
      </div>
      <div className="rounded-2xl bg-muted px-4 py-3">
        <p className="text-gray-400">Next 7 days</p>
        <p className="text-lg font-semibold text-text">
          {formatCurrency(sevenDayTotal, currency)}
        </p>
      </div>
      <div className="rounded-2xl bg-muted px-4 py-3">
        <p className="text-gray-400">Next 30 days</p>
        <p className="text-lg font-semibold text-text">
          {formatCurrency(thirtyDayTotal, currency)}
        </p>
      </div>
    </div>
    <div className="flex gap-3">
      <button
        onClick={onExport}
        className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        Export JSON
      </button>
      <button
        onClick={onImport}
        className="rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        Import JSON
      </button>
    </div>
  </div>
);

export default TotalsBar;
