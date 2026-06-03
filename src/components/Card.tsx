import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: Props) {
  return <div className={`app-card fade-up ${className}`}>{children}</div>;
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
  const c = tone === 'danger' ? 'var(--danger)' : tone === 'gold' ? 'var(--gold)' : 'var(--green)';
  return (
    <div
      className="flex-1 text-center"
      style={{
        borderRadius: 18,
        background: `rgb(${c} / 0.05)`,
        borderTop: `3px solid rgb(${c})`,
        padding: '16px 10px',
        boxShadow: '0 2px 12px rgb(var(--green) / .06)',
      }}
    >
      <div style={{ fontSize: 30, lineHeight: 1, marginBottom: 6 }} aria-hidden>
        {emoji}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'rgb(var(--muted))', marginBottom: 5 }}>
        {label}
      </div>
      <div className="num" style={{ fontSize: 19, fontWeight: 900, color: `rgb(${c})` }}>
        {valueMain}
      </div>
      {valueSub && (
        <div className="num" style={{ fontSize: 11, fontWeight: 700, color: 'rgb(var(--muted))' }}>
          {valueSub}
        </div>
      )}
    </div>
  );
}
