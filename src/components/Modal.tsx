import {
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

// Wraps the native <dialog> element so we get free focus trap, ESC-to-close,
// and a true top-layer backdrop without pulling in a modal library.
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    // A click whose target is the dialog itself (not a descendant) is a click
    // on the backdrop region — close on backdrop click.
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleClick}
      className={cn(
        'w-full max-w-md rounded-lg border border-border bg-surface p-0 text-ink-700 shadow-xl backdrop:bg-ink-900/40 backdrop:backdrop-blur-sm',
        className,
      )}
    >
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-ink-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-ink-500">{description}</p>
        )}
      </div>
      <div className="px-5 py-4">{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-2 border-t border-border bg-canvas px-5 py-3">
          {footer}
        </div>
      )}
    </dialog>
  );
}
