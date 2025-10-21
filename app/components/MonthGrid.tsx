'use client';

import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { format } from 'date-fns';
import Badge from './Badge';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  count: number;
  isOverdue: boolean;
}

interface MonthGridProps {
  monthLabel: string;
  days: CalendarDay[];
  onSelectDay: (day: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAddBill: () => void;
  onToday: () => void;
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthGrid = ({
  monthLabel,
  days,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  onAddBill,
  onToday,
}: MonthGridProps) => {
  return (
    <section className="rounded-3xl bg-surface p-6 shadow-lg">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-text">{monthLabel}</h1>
          <p className="text-sm text-gray-400">
            Click a day to review upcoming subscriptions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onToday}
            className="rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Today
          </button>
          <button
            onClick={onAddBill}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <PlusIcon className="h-4 w-4" /> Add bill
          </button>
          <div className="ml-2 flex items-center gap-2">
            <button
              aria-label="Previous month"
              onClick={onPrevMonth}
              className="rounded-full bg-muted p-2 text-text transition hover:bg-accent hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              aria-label="Next month"
              onClick={onNextMonth}
              className="rounded-full bg-muted p-2 text-text transition hover:bg-accent hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-7 gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {weekdayLabels.map((label) => (
          <div key={label} className="text-center">
            {label}
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const key = format(day.date, 'yyyy-MM-dd');
          return (
            <button
              key={key}
              onClick={() => onSelectDay(day.date)}
              className={clsx(
                'flex h-24 flex-col rounded-2xl border border-muted bg-background p-3 text-left transition hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                !day.isCurrentMonth && 'opacity-50',
                day.isToday && 'border-accent shadow-lg',
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-text">
                  {format(day.date, 'd')}
                </span>
                {day.count > 0 && (
                  <Badge value={day.count} variant={day.isOverdue ? 'danger' : 'default'} />
                )}
              </div>
              <span className="mt-auto text-xs text-gray-500">
                {day.count === 0
                  ? 'No bills'
                  : day.count === 1
                  ? '1 bill'
                  : `${day.count} bills`}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MonthGrid;
