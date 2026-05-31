import { useApp } from '../state/AppContext';
import { computeTotals } from '../lib/calc';
import { fmtTRY, fmtUSD } from '../lib/format';
import ProgressBar from './ProgressBar';

export default function IdentityCard() {
  const { data } = useApp();
  const t = computeTotals(data);
  const name = data.settings.userName || 'صديقي';
  const avatar = data.settings.userAvatar;

  return (
    <div className="mb-3 rounded-card bg-green text-white p-4 shadow-card border-t-2 border-gold">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-14 h-14 rounded-full bg-white/15 border-2 border-gold grid place-items-center text-xl font-black overflow-hidden shrink-0">
          {avatar ? (
            <img src={avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <span>{name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white/75 text-sm font-bold">مرحباً،</div>
          <div className="text-xl font-black truncate">{name} 👋</div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/80 text-sm font-bold">راتبي هذا الشهر</span>
        <span className="font-black num">
          {fmtUSD(t.salaryUSD)} · <span className="text-gold">{fmtTRY(t.salaryTRY)}</span>
        </span>
      </div>
      <ProgressBar percent={t.spentPercent} />
      <div className="text-xs font-bold text-white/70 mt-2 num">
        صرفت {Math.round(t.spentPercent)}% حتى الآن
      </div>
    </div>
  );
}
