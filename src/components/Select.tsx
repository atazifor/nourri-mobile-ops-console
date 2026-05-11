import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  containerClassName?: string;
}

export function Select({
  className,
  containerClassName,
  children,
  ...rest
}: SelectProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <select
        {...rest}
        className={cn(
          'h-9 w-full appearance-none rounded-md border border-border bg-surface pl-3 pr-9 text-sm text-ink-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100',
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
      />
    </div>
  );
}
