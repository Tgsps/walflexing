import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative w-full sm:max-w-md max-h-[88vh] overflow-y-auto bg-cream rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slideup nav-safe">
        <div className="sticky top-0 bg-green text-white flex items-center justify-between px-4 py-3 rounded-t-3xl">
          <h2 className="font-black text-lg truncate">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 grid place-items-center rounded-full bg-white/15 active:scale-95"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
