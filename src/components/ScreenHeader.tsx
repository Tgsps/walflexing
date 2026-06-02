import type { ReactNode } from 'react';

interface Props {
  emoji: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function ScreenHeader({ emoji, title, subtitle, action }: Props) {
  return (
    <header className="flex items-start gap-3.5 mb-5">
      <div className="leading-none shrink-0" style={{ fontSize: 44 }} aria-hidden>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-black text-green leading-tight">{title}</h1>
        <div className="gold-rule mt-1.5" />
        {subtitle && <p className="text-sm text-muted font-medium mt-1.5">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
