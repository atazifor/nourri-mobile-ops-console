import type { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  containerClassName?: string;
}

export function SearchInput({
  className,
  containerClassName,
  ...rest
}: SearchInputProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
      />
      <input
        type="search"
        {...rest}
        className={cn(
          'h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100',
          className,
        )}
      />
    </div>
  );
}
