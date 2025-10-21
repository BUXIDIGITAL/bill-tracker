import {
  addDays,
  addMonths,
  endOfMonth,
  isAfter,
  isBefore,
  lastDayOfMonth,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import type { Bill } from './types';

const MAX_ITERATIONS = 2000;

export const addMonthsSafe = (date: Date, months: number) => {
  const target = addMonths(date, months);
  const day = date.getDate();
  const end = lastDayOfMonth(target).getDate();
  const result = new Date(target);
  result.setDate(Math.min(day, end));
  return result;
};

const nextOccurrence = (current: Date, bill: Bill): Date | null => {
  switch (bill.recurrence.type) {
    case 'WEEKLY':
      return addDays(current, 7);
    case 'EVERY_30_DAYS':
      return addDays(current, 30);
    case 'MONTHLY':
      return addMonthsSafe(current, 1);
    case 'QUARTERLY':
      return addMonthsSafe(current, 3);
    case 'ANNUALLY':
      return addMonthsSafe(current, 12);
    case 'CUSTOM_DAYS': {
      const interval = bill.recurrence.intervalDays ?? 1;
      if (interval <= 0) return null;
      return addDays(current, interval);
    }
    default:
      return null;
  }
};

const normalize = (value: Date | string) => startOfDay(new Date(value));

export const getOccurrencesInRange = (bill: Bill, rangeStart: Date, rangeEnd: Date) => {
  if (!bill.active) return [] as Date[];
  const occurrences: Date[] = [];
  let occurrence = normalize(bill.firstDueDate);
  const start = startOfDay(rangeStart);
  const end = startOfDay(rangeEnd);
  if (isAfter(occurrence, end)) {
    return [];
  }
  let iterations = 0;
  while (isBefore(occurrence, start) && iterations < MAX_ITERATIONS) {
    const next = nextOccurrence(occurrence, bill);
    if (!next) return [];
    occurrence = next;
    iterations += 1;
    if (iterations >= MAX_ITERATIONS) break;
  }

  while (!isAfter(occurrence, end) && iterations < MAX_ITERATIONS) {
    if (!isBefore(occurrence, start)) {
      occurrences.push(occurrence);
    }
    const next = nextOccurrence(occurrence, bill);
    if (!next) break;
    occurrence = next;
    iterations += 1;
  }

  return occurrences;
};

export const getOccurrencesInMonth = (bill: Bill, year: number, monthIndex: number) => {
  const start = startOfMonth(new Date(year, monthIndex, 1));
  const end = endOfMonth(start);
  return getOccurrencesInRange(bill, start, end);
};

export const getNextDue = (bill: Bill, fromDate: Date = new Date()): Date | null => {
  if (!bill.active) return null;
  const target = startOfDay(fromDate);
  let occurrence = normalize(bill.firstDueDate);
  if (!isBefore(occurrence, target)) {
    return occurrence;
  }
  let iterations = 0;
  while (iterations < MAX_ITERATIONS) {
    const next = nextOccurrence(occurrence, bill);
    if (!next) return null;
    if (!isBefore(next, target)) {
      return next;
    }
    occurrence = next;
    iterations += 1;
  }
  return null;
};

export const isOverdue = (bill: Bill, referenceDate: Date = new Date()): boolean => {
  if (!bill.active) return false;
  const target = startOfDay(referenceDate);
  let occurrence = normalize(bill.firstDueDate);
  if (!isBefore(occurrence, target)) {
    return false;
  }
  let last = occurrence;
  let iterations = 0;
  while (iterations < MAX_ITERATIONS) {
    const next = nextOccurrence(occurrence, bill);
    if (!next || !isBefore(next, target)) {
      break;
    }
    last = next;
    occurrence = next;
    iterations += 1;
  }
  return isBefore(last, target);
};
