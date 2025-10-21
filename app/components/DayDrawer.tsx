'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';
import type { Bill } from '@/lib/types';

interface DayDrawerProps {
  open: boolean;
  date: Date | null;
  bills: Bill[];
  onClose: () => void;
  onEdit: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
}

const frequencyLabels: Record<string, string> = {
  WEEKLY: 'Weekly',
  EVERY_30_DAYS: 'Every 30 days',
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  ANNUALLY: 'Annually',
  CUSTOM_DAYS: 'Custom interval',
};

const DayDrawer = ({ open, date, bills, onClose, onEdit, onDelete }: DayDrawerProps) => {
  const title = date ? format(date, 'EEEE, MMMM d') : '';
  return (
    <Transition show={open} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="w-screen max-w-md overflow-y-auto bg-surface p-6 shadow-2xl">
              <Dialog.Title className="text-2xl font-semibold text-accent">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-gray-400">
                {bills.length} item{bills.length === 1 ? '' : 's'} due
              </Dialog.Description>

              <div className="mt-6 space-y-4">
                {bills.length === 0 ? (
                  <p className="rounded-2xl bg-muted p-4 text-sm text-gray-300">
                    No bills are scheduled for this day.
                  </p>
                ) : (
                  bills.map((bill) => (
                    <article
                      key={bill.id}
                      className="rounded-2xl bg-muted p-4 shadow-inner"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-text">
                            {bill.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {frequencyLabels[bill.recurrence.type]}
                            {bill.recurrence.type === 'CUSTOM_DAYS' &&
                              bill.recurrence.intervalDays
                              ? ` • Every ${bill.recurrence.intervalDays} days`
                              : ''}
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-accent">
                          {formatCurrency(bill.amount, bill.currency)}
                        </p>
                      </div>
                      {bill.notes && (
                        <p className="mt-2 text-sm text-gray-300">{bill.notes}</p>
                      )}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => onEdit(bill)}
                          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(bill)}
                          className="rounded-full border border-error px-4 py-2 text-sm font-semibold text-error transition hover:bg-error/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <button
                onClick={onClose}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-accent px-4 py-3 text-sm font-semibold text-accent transition hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Close
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DayDrawer;
