'use client';

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const IconButton = ({ label, className, ...props }: IconButtonProps) => (
  <button
    aria-label={label}
    className={clsx(
      'inline-flex items-center justify-center rounded-full bg-muted p-2 text-text transition hover:bg-accent hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      className,
    )}
    {...props}
  />
);

export default IconButton;
