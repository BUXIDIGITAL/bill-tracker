'use client';

import { v4 as uuid } from 'uuid';
import type { Bill } from './types';

const STORAGE_KEY = 'bill-tracker:v1:bills';
const SEEDED_KEY = 'bill-tracker:v1:seeded';

const demoBills: Bill[] = [
  {
    id: uuid(),
    name: 'Netflix',
    amount: 19.99,
    currency: 'CAD',
    firstDueDate: new Date().toISOString(),
    recurrence: { type: 'MONTHLY' },
    notes: 'Premium plan',
    active: true,
  },
  {
    id: uuid(),
    name: 'Hydro',
    amount: 85.5,
    currency: 'CAD',
    firstDueDate: new Date(new Date().setDate(12)).toISOString(),
    recurrence: { type: 'MONTHLY' },
    active: true,
  },
  {
    id: uuid(),
    name: 'Internet',
    amount: 99.99,
    currency: 'CAD',
    firstDueDate: new Date(new Date().setDate(5)).toISOString(),
    recurrence: { type: 'MONTHLY' },
    notes: '1 Gbps fiber',
    active: true,
  },
  {
    id: uuid(),
    name: 'Insurance',
    amount: 180.0,
    currency: 'CAD',
    firstDueDate: new Date(new Date().setMonth(new Date().getMonth(), 20)).toISOString(),
    recurrence: { type: 'QUARTERLY' },
    active: true,
  },
];

const safeParse = (value: string | null): Bill[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as Bill[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to parse bills from storage', error);
    return [];
  }
};

export const loadBills = (): Bill[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return safeParse(raw);
};

export const saveBills = (bills: Bill[]): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
};

export const seedDemoDataOnce = (): Bill[] => {
  if (typeof window === 'undefined') return [];
  const seeded = window.localStorage.getItem(SEEDED_KEY);
  if (seeded) {
    return loadBills();
  }
  window.localStorage.setItem(SEEDED_KEY, 'true');
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoBills));
  return [...demoBills];
};

export const exportBills = (bills: Bill[]) => {
  const blob = new Blob([JSON.stringify(bills, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'bill-tracker-data.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const importBills = async (file: File): Promise<Bill[]> => {
  const text = await file.text();
  const bills = safeParse(text);
  return bills;
};

export const generateId = () => uuid();
