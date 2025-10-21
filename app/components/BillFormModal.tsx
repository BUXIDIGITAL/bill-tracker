'use client';

import { Dialog, Transition, Switch } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import clsx from 'clsx';
import type { Bill, Currency, RecurrenceType } from '@/lib/types';
import { generateId } from '@/lib/storage';

interface BillFormValues {
  id?: string;
  name: string;
  amount: string;
  currency: Currency;
  firstDueDate: string;
  recurrenceType: RecurrenceType;
  intervalDays?: string;
  notes: string;
  active: boolean;
}

interface BillFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (bill: Bill) => void;
  initialBill?: Bill | null;
}

const emptyValues = (): BillFormValues => ({
  name: '',
  amount: '',
  currency: 'CAD',
  firstDueDate: new Date().toISOString().split('T')[0],
  recurrenceType: 'MONTHLY',
  notes: '',
  active: true,
});

const BillFormModal = ({ open, onClose, onSave, initialBill }: BillFormModalProps) => {
  const [values, setValues] = useState<BillFormValues>(emptyValues);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBill) {
      setValues({
        id: initialBill.id,
        name: initialBill.name,
        amount: initialBill.amount.toString(),
        currency: initialBill.currency,
        firstDueDate: initialBill.firstDueDate.split('T')[0],
        recurrenceType: initialBill.recurrence.type,
        intervalDays: initialBill.recurrence.intervalDays?.toString(),
        notes: initialBill.notes ?? '',
        active: initialBill.active,
      });
    } else if (open) {
      setValues(emptyValues());
    }
  }, [initialBill, open]);

  const title = initialBill ? 'Edit bill' : 'Add bill';

  const isCustom = values.recurrenceType === 'CUSTOM_DAYS';

  const handleChange = (field: keyof BillFormValues, value: string | boolean) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = () => {
    if (!values.name.trim()) {
      setError('Name is required');
      return;
    }
    const amount = Number(values.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (!values.firstDueDate) {
      setError('First due date is required');
      return;
    }
    if (isCustom) {
      const interval = Number(values.intervalDays);
      if (Number.isNaN(interval) || interval <= 0) {
        setError('Custom interval must be at least 1 day');
        return;
      }
    }

    const bill: Bill = {
      id: values.id ?? generateId(),
      name: values.name.trim(),
      amount,
      currency: values.currency,
      firstDueDate: new Date(values.firstDueDate).toISOString(),
      recurrence: {
        type: values.recurrenceType,
        ...(isCustom
          ? { intervalDays: Number(values.intervalDays) }
          : {}),
      },
      notes: values.notes.trim() ? values.notes.trim() : undefined,
      active: values.active,
    };

    setError(null);
    onSave(bill);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                onKeyDown={handleKeyDown}
                className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-surface p-6 text-left align-middle shadow-xl"
              >
                <Dialog.Title className="text-2xl font-semibold text-accent">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-gray-400">
                  Manage recurring bill details
                </Dialog.Description>

                <form className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Name</label>
                    <input
                      value={values.name}
                      onChange={(event) => handleChange('name', event.target.value)}
                      className="mt-1 w-full rounded-2xl border border-muted bg-background px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Subscription name"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-300">Amount</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={values.amount}
                        onChange={(event) => handleChange('amount', event.target.value)}
                        className="mt-1 w-full rounded-2xl border border-muted bg-background px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Currency</label>
                      <select
                        value={values.currency}
                        onChange={(event) => handleChange('currency', event.target.value as Currency)}
                        className="mt-1 w-full rounded-2xl border border-muted bg-background px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="CAD">CAD</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">First due date</label>
                    <input
                      type="date"
                      value={values.firstDueDate}
                      onChange={(event) => handleChange('firstDueDate', event.target.value)}
                      className="mt-1 w-full rounded-2xl border border-muted bg-background px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">Recurrence</label>
                    <select
                      value={values.recurrenceType}
                      onChange={(event) => handleChange('recurrenceType', event.target.value as RecurrenceType)}
                      className="mt-1 w-full rounded-2xl border border-muted bg-background px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="WEEKLY">Weekly</option>
                      <option value="EVERY_30_DAYS">Every 30 days</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="ANNUALLY">Annually</option>
                      <option value="CUSTOM_DAYS">Custom interval</option>
                    </select>
                  </div>

                  {isCustom && (
                    <div>
                      <label className="text-sm font-medium text-gray-300">Every N days</label>
                      <input
                        type="number"
                        min="1"
                        value={values.intervalDays ?? ''}
                        onChange={(event) => handleChange('intervalDays', event.target.value)}
                        className="mt-1 w-full rounded-2xl border border-muted bg-background px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-300">Notes</label>
                    <textarea
                      value={values.notes}
                      onChange={(event) => handleChange('notes', event.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-2xl border border-muted bg-background px-4 py-2 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <Switch.Group as="div" className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <Switch.Label className="text-sm font-medium text-gray-300">
                        Active
                      </Switch.Label>
                      <Switch.Description className="text-xs text-gray-400">
                        Disable to pause reminders
                      </Switch.Description>
                    </div>
                    <Switch
                      checked={values.active}
                      onChange={(checked) => handleChange('active', checked)}
                      className={clsx(
                        values.active ? 'bg-accent' : 'bg-muted',
                        'relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                      )}
                    >
                      <span
                        className={clsx(
                          values.active ? 'translate-x-6 bg-surface' : 'translate-x-1 bg-gray-400',
                          'inline-block h-4 w-4 transform rounded-full transition',
                        )}
                      />
                    </Switch>
                  </Switch.Group>
                </form>

                {error && (
                  <p className="mt-4 rounded-2xl bg-error/10 px-4 py-2 text-sm text-error">{error}</p>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    className="w-full rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:w-auto"
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BillFormModal;
