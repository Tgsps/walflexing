import { progressLevel } from '../lib/calc';

const GRAD: Record<string, string> = {
  ok: 'linear-gradient(90deg,#268C5A,#32B070)',
  warn: 'linear-gradient(90deg,#C89400,#E0AA20)',
  danger: 'linear-gradient(90deg,#C34140,#E05050)',
};
const GLOW: Record<string, string> = {
  ok: '#32B070',
  warn: '#E0AA20',
  danger: '#E05050',
};

interface Props {
  percent: number;
  height?: number;
  /** ملء ذهبي على مسار شفّاف — للاستخدام فوق سطح أخضر (الهيرو) */
  onGreen?: boolean;
}

export default function ProgressBar({ percent, height = 8, onGreen = false }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const level = progressLevel(percent);
  const fillStyle = onGreen
    ? { background: 'rgb(var(--gold))', boxShadow: '0 0 12px rgb(var(--gold) / 0.6)' }
    : { background: GRAD[level], boxShadow: `0 0 10px ${GLOW[level]}99` };
  return (
    <div
      className="rounded-full overflow-hidden"
      style={{ height, background: onGreen ? 'rgba(255,255,255,.12)' : 'rgb(var(--line))' }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, ...fillStyle }}
      />
    </div>
  );
}
