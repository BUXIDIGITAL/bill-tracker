export type Currency = 'CAD' | 'USD' | 'EUR';

export type RecurrenceType =
  | 'WEEKLY'
  | 'EVERY_30_DAYS'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'ANNUALLY'
  | 'CUSTOM_DAYS';

export interface Recurrence {
  type: RecurrenceType;
  intervalDays?: number;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  firstDueDate: string; // ISO string
  recurrence: Recurrence;
  notes?: string;
  active: boolean;
}
