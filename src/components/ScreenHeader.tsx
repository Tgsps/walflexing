import type { ReactNode } from 'react';

interface Props {
  emoji: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function ScreenHeader({ emoji, title, subtitle, action }: Props) {
  return (
    <header className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 shrink-0 rounded-[13px] bg-green text-white grid place-items-center text-2xl shadow-soft">
        <span aria-hidden>{emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-black text-green leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-sm text-muted font-medium leading-tight">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
