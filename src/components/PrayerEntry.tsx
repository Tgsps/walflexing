import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MoonStar, ChevronLeft } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { nextPrayer, fmtCountdown } from '../lib/prayer';

export default function PrayerEntry() {
  const { t, i18n } = useTranslation();
  const { data } = useApp();
  const timings = data.prayer.timings;
  let sub = t('prayer.subtitle');
  if (timings) {
    const np = nextPrayer(timings);
    sub = t('prayer.nextIn', { name: t(`prayerNames.${np.name}`), time: fmtCountdown(np.minutesUntil, i18n.language) });
  }

  return (
    <Link
      to="/prayer"
      className="fade-up mb-3 flex items-center gap-3 rounded-card p-4"
      style={{
        background: 'linear-gradient(135deg, rgb(var(--green-2)), rgb(var(--green)))',
        border: '1.5px solid rgb(var(--gold) / 0.6)',
        boxShadow: '0 6px 22px rgba(6,45,35,.22)',
      }}
    >
      <span className="w-10 h-10 shrink-0 rounded-xl bg-white/15 grid place-items-center text-gold">
        <MoonStar size={20} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-black text-white">🕌 {t('prayer.title')}</div>
        <div className="num text-xs font-bold text-gold/90 truncate">{sub}</div>
      </div>
      <ChevronLeft size={20} className="text-white/60 ltr:rotate-180" />
    </Link>
  );
}
