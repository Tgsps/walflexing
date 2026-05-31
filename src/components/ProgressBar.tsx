import { PROGRESS_COLOR, progressLevel } from '../lib/calc';

interface Props {
  percent: number;
}

export default function ProgressBar({ percent }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const level = progressLevel(percent);
  const color = PROGRESS_COLOR[level];
  return (
    <div className="w-full h-3 rounded-full bg-line overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  );
}
