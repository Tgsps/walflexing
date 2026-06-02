import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: Props) {
  const { t } = useTranslation();
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md max-h-[88vh] overflow-y-auto bg-card rounded-t-modal sm:rounded-modal shadow-2xl animate-slideup nav-safe px-5 pt-3 pb-5">
        <div className="w-10 h-1 rounded-full bg-line mx-auto mb-3.5" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-black text-lg text-green leading-tight truncate">{title}</h2>
            <div className="gold-rule mt-1" style={{ width: 32 }} />
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-green/10 text-green active:scale-95"
            aria-label={t('common.close')}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
