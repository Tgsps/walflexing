import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: Props) {
  return <div className={`app-card ${className}`}>{children}</div>;
}

export function StatCard({
  emoji,
  label,
  valueMain,
  valueSub,
  tone = 'green',
}: {
  emoji: string;
  label: string;
  valueMain: string;
  valueSub?: string;
  tone?: 'green' | 'gold' | 'danger';
}) {
  const toneColor =
    tone === 'danger' ? 'text-danger' : tone === 'gold' ? 'text-gold' : 'text-green';
  return (
    <div className="bg-card rounded-card shadow-soft border border-line p-3 text-center">
      <div className="text-xl mb-1" aria-hidden>
        {emoji}
      </div>
      <div className="text-xs text-muted font-bold mb-1">{label}</div>
      <div className={`text-base font-black num ${toneColor}`}>{valueMain}</div>
      {valueSub && <div className="text-xs text-muted font-bold num">{valueSub}</div>}
    </div>
  );
}
