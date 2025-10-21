'use client';

import clsx from 'clsx';

interface BadgeProps {
  value: number;
  variant?: 'default' | 'danger';
}

const Badge = ({ value, variant = 'default' }: BadgeProps) => (
  <span
    className={clsx(
      'ml-auto rounded-full px-2 py-0.5 text-xs font-semibold',
      variant === 'danger'
        ? 'bg-error text-background'
        : 'bg-accent text-background',
    )}
  >
    {value}
  </span>
);

export default Badge;
