'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import MonthGrid, { CalendarDay } from './components/MonthGrid';
import DayDrawer from './components/DayDrawer';
import BillFormModal from './components/BillFormModal';
import TotalsBar from './components/TotalsBar';
import type { Bill } from './lib/types';
import {
  exportBills,
  importBills,
  loadBills,
  saveBills,
  seedDemoDataOnce,
} from './lib/storage';
import { getOccurrencesInRange } from './lib/recurrence';

const getKey = (date: Date) => format(date, 'yyyy-MM-dd');

export default function HomePage() {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [initialized, setInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const existing = loadBills();
    if (existing.length > 0) {
      setBills(existing);
    } else {
      const seeded = seedDemoDataOnce();
      setBills(seeded);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      saveBills(bills);
    }
  }, [bills, initialized]);

  const today = useMemo(() => startOfDay(new Date()), []);

  const rangeMap = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const rangeStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const rangeEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const map = new Map<string, Bill[]>();
    bills.forEach((bill) => {
      const occurrences = getOccurrencesInRange(bill, rangeStart, rangeEnd);
      occurrences.forEach((occurrence) => {
        const key = getKey(occurrence);
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key)!.push(bill);
      });
    });
    return {
      monthStart,
      monthEnd,
      rangeStart,
      rangeEnd,
      map,
    };
  }, [bills, viewDate]);

  const calendarDays: CalendarDay[] = useMemo(() => {
    const days = eachDayOfInterval({
      start: rangeMap.rangeStart,
      end: rangeMap.rangeEnd,
    });
    return days.map((date) => {
      const key = getKey(date);
      const dueBills = rangeMap.map.get(key) ?? [];
      return {
        date,
        isCurrentMonth: isSameMonth(date, rangeMap.monthStart),
        isToday: isToday(date),
        count: dueBills.length,
        isOverdue: isBefore(date, today) && dueBills.length > 0,
      };
    });
  }, [rangeMap, today]);

  const selectedBills = useMemo(() => {
    if (!selectedDate) return [] as Bill[];
    const key = getKey(selectedDate);
    return rangeMap.map.get(key) ?? [];
  }, [rangeMap, selectedDate]);

  const baseCurrency = bills[0]?.currency ?? 'CAD';

  const totals = useMemo(() => {
    const sumForRange = (start: Date, end: Date) => {
      return bills.reduce((total, bill) => {
        const occurrences = getOccurrencesInRange(bill, start, end);
        return total + occurrences.length * bill.amount;
      }, 0);
    };
    const monthTotal = sumForRange(rangeMap.monthStart, rangeMap.monthEnd);
    const nextSevenTotal = sumForRange(today, addDays(today, 6));
    const nextThirtyTotal = sumForRange(today, addDays(today, 29));
    return {
      monthTotal,
      nextSevenTotal,
      nextThirtyTotal,
    };
  }, [bills, rangeMap.monthEnd, rangeMap.monthStart, today]);

  const openDrawerForDay = (date: Date) => {
    setSelectedDate(date);
    setDrawerOpen(true);
  };

  const handleDelete = (bill: Bill) => {
    if (window.confirm(`Delete ${bill.name}?`)) {
      setBills((prev) => prev.filter((item) => item.id !== bill.id));
    }
  };

  const handleSaveBill = (bill: Bill) => {
    setBills((prev) => {
      const exists = prev.find((item) => item.id === bill.id);
      if (exists) {
        return prev.map((item) => (item.id === bill.id ? bill : item));
      }
      return [...prev, bill];
    });
    setFormOpen(false);
    setEditingBill(null);
  };

  const handleAddNew = () => {
    setEditingBill(null);
    setFormOpen(true);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const confirmed = window.confirm('Importing will replace existing bills. Continue?');
    if (!confirmed) {
      event.target.value = '';
      return;
    }
    try {
      const imported = await importBills(file);
      setBills(imported);
    } catch (error) {
      console.error('Failed to import bills', error);
      alert('Failed to import JSON file.');
    } finally {
      event.target.value = '';
    }
  };

  const monthLabel = format(rangeMap.monthStart, 'MMMM yyyy');

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <TotalsBar
        bills={bills.filter((bill) => bill.active)}
        monthTotal={totals.monthTotal}
        sevenDayTotal={totals.nextSevenTotal}
        thirtyDayTotal={totals.nextThirtyTotal}
        currency={baseCurrency}
        onExport={() => exportBills(bills)}
        onImport={handleImport}
      />

      <MonthGrid
        monthLabel={monthLabel}
        days={calendarDays}
        onSelectDay={openDrawerForDay}
        onPrevMonth={() => setViewDate((date) => addMonths(date, -1))}
        onNextMonth={() => setViewDate((date) => addMonths(date, 1))}
        onAddBill={handleAddNew}
        onToday={() => setViewDate(new Date())}
      />

      <DayDrawer
        open={drawerOpen}
        date={selectedDate}
        bills={selectedBills}
        onClose={() => setDrawerOpen(false)}
        onEdit={(bill) => {
          setEditingBill(bill);
          setFormOpen(true);
        }}
        onDelete={handleDelete}
      />

      <BillFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingBill(null);
        }}
        onSave={handleSaveBill}
        initialBill={editingBill}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="sr-only"
        onChange={handleFileChange}
      />
    </main>
  );
}
