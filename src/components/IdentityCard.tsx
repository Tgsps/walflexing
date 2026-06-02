import { useApp } from '../state/AppContext';
import { computeTotals } from '../lib/calc';
import { fmtTRY, fmtUSD } from '../lib/format';
import ProgressBar from './ProgressBar';

const AR_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

export default function IdentityCard() {
  const { data } = useApp();
  const t = computeTotals(data);
  const name = data.settings.userName || 'صديقي';
  const avatar = data.settings.userAvatar;
  const month = AR_MONTHS[new Date().getMonth()];

  return (
    <div
      className="fade-up relative overflow-hidden mb-4"
      style={{
        borderRadius: 24,
        padding: 20,
        background: 'linear-gradient(135deg, rgb(var(--green-2)), rgb(var(--green)))',
        boxShadow: '0 8px 28px rgba(6,45,35,.28)',
      }}
    >
      {/* grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.05,
          backgroundImage: 'radial-gradient(rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '4px 4px',
        }}
      />
      {/* geometric gold lines, top-start corner */}
      <svg
        className="absolute -top-2.5 -left-2.5"
        style={{ opacity: 0.5 }}
        width="120"
        height="90"
        viewBox="0 0 120 90"
        fill="none"
        aria-hidden
      >
        <path d="M0 12 L120 -30" stroke="rgb(var(--gold))" strokeWidth="1.5" />
        <path d="M0 30 L120 -12" stroke="rgb(var(--gold))" strokeWidth="1.5" opacity=".6" />
        <path d="M0 48 L120 6" stroke="rgb(var(--gold))" strokeWidth="1.5" opacity=".3" />
      </svg>

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="shrink-0 grid place-items-center overflow-hidden text-white font-black"
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              fontSize: 22,
              background: 'rgba(255,255,255,.12)',
              border: '2px solid rgb(var(--gold))',
              boxShadow: '0 0 16px rgba(196,148,24,.45)',
            }}
          >
            {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white/70 text-[13px] font-bold">مرحباً،</div>
            <div className="text-white text-xl font-black truncate">{name} 👋</div>
          </div>
        </div>

        <div className="flex items-end justify-between mb-2.5">
          <span className="text-white/80 text-[13px] font-bold">راتبي هذا الشهر</span>
          <span
            className="num font-black whitespace-nowrap"
            style={{ fontSize: 30, color: 'rgb(var(--gold))' }}
          >
            {fmtTRY(t.salaryTRY)}
          </span>
        </div>

        <ProgressBar percent={t.spentPercent} height={6} onGreen />

        <div className="flex justify-between mt-2.5">
          {[
            ['💵', fmtUSD(t.salaryUSD)],
            ['📈', `صرفت ${Math.round(t.spentPercent)}%`],
            ['🗓️', month],
          ].map(([e, label], i) => (
            <span
              key={i}
              className="num text-white font-bold"
              style={{ background: 'rgba(255,255,255,.15)', borderRadius: 9999, padding: '5px 12px', fontSize: 12 }}
            >
              {e} {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
