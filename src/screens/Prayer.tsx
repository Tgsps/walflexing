import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Check, Sun, Moon } from 'lucide-react';
import { useApp } from '../state/AppContext';
import Card from '../components/Card';
import { todayISODate } from '../lib/format';
import { fetchPrayerTimes, nextPrayer, fmtCountdown, PRAYER_ORDER } from '../lib/prayer';
import { MORNING_ADHKAR, EVENING_ADHKAR } from '../data/adhkar';
import type { PrayerTimings } from '../types';

type Status = 'idle' | 'locating' | 'ok' | 'needLocation' | 'error';

export default function Prayer() {
  const { t, i18n } = useTranslation();
  const { data, update } = useApp();
  const [status, setStatus] = useState<Status>('idle');
  const [now, setNow] = useState(new Date());

  // daily reset + fetch on mount
  useEffect(() => {
    const today = todayISODate();
    if (data.prayer.lastResetDate !== today) {
      update((d) => {
        d.prayer.morningAdhkarDone = Array(10).fill(false);
        d.prayer.eveningAdhkarDone = Array(10).fill(false);
        d.prayer.morningAdhkarCounts = Array(10).fill(0);
        d.prayer.eveningAdhkarCounts = Array(10).fill(0);
        d.prayer.lastResetDate = today;
      });
    }
    const fetchedToday = data.prayer.timingsFetchedAt?.slice(0, 10) === today;
    if (data.prayer.timings && fetchedToday) setStatus('ok');
    else requestTimes();
    const iv = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestTimes = () => {
    if (!('geolocation' in navigator)) return setStatus('needLocation');
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const ti = await fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
        if (ti) {
          update((d) => {
            d.prayer.timings = ti;
            d.prayer.timingsFetchedAt = new Date().toISOString();
          });
          setStatus('ok');
        } else setStatus('error');
      },
      () => setStatus(data.prayer.timings ? 'ok' : 'needLocation'),
      { timeout: 8000, maximumAge: 3600000 },
    );
  };

  const timings = data.prayer.timings;
  const np = timings ? nextPrayer(timings, now) : null;

  return (
    <div>
      <header className="flex items-center gap-3 mb-5">
        <Link to="/settings" className="w-10 h-10 shrink-0 grid place-items-center rounded-xl bg-card border border-line text-green active:scale-95" aria-label={t('common.back')}>
          <ArrowLeft size={20} className="rtl:rotate-180" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black text-green leading-tight">🕌 {t('prayer.title')}</h1>
          <div className="gold-rule mt-1.5" />
          <p className="text-sm text-muted font-medium mt-1.5">{t('prayer.subtitle')}</p>
        </div>
      </header>

      {/* SECTION A — prayer times */}
      <Card className="mb-3">
        <h2 className="font-black text-green mb-3">🕰️ {t('prayer.times')}</h2>
        {status === 'locating' && <div className="text-sm font-bold text-muted">📍 {t('prayer.loading')}</div>}
        {(status === 'needLocation' || (status === 'error' && !timings)) && (
          <div className="text-center py-2">
            <p className="text-sm font-bold text-muted mb-3">{status === 'error' ? t('prayer.error') : t('prayer.needLocation')}</p>
            <button onClick={requestTimes} className="btn-primary inline-flex items-center gap-2">
              <MapPin size={18} /> {t('prayer.allow')}
            </button>
          </div>
        )}
        {timings && (
          <>
            {np && (
              <div className="bg-green text-white rounded-xl px-3 py-2.5 mb-3 text-center font-black num">
                ⏳ {t('prayer.nextIn', { name: t(`prayerNames.${np.name}`), time: fmtCountdown(np.minutesUntil, i18n.language) })}
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              {PRAYER_ORDER.map((p) => {
                const isNext = np?.name === p;
                return (
                  <div
                    key={p}
                    className={`rounded-xl p-2.5 text-center border-2 ${isNext ? 'border-gold bg-gold/10' : 'border-line bg-cream/50'}`}
                  >
                    <div className="text-xs font-bold text-muted">{t(`prayerNames.${p}`)}</div>
                    <div className="num font-black text-green">{timings[p]}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      <AdhkarList which="morning" />
      <AdhkarList which="evening" />

      <p className="text-xs text-muted font-bold text-center mt-1 mb-2">{t('prayer.resetNote')}</p>
    </div>
  );
}

function AdhkarList({ which }: { which: 'morning' | 'evening' }) {
  const { t, i18n } = useTranslation();
  const { data, update } = useApp();
  const lng = i18n.language;
  const list = which === 'morning' ? MORNING_ADHKAR : EVENING_ADHKAR;
  const counts = which === 'morning' ? data.prayer.morningAdhkarCounts : data.prayer.eveningAdhkarCounts;
  const done = which === 'morning' ? data.prayer.morningAdhkarDone : data.prayer.eveningAdhkarDone;

  const tap = (i: number, target: number) =>
    update((d) => {
      const c = which === 'morning' ? d.prayer.morningAdhkarCounts : d.prayer.eveningAdhkarCounts;
      const dn = which === 'morning' ? d.prayer.morningAdhkarDone : d.prayer.eveningAdhkarDone;
      const next = (c[i] || 0) + 1 > target ? 0 : (c[i] || 0) + 1;
      c[i] = next;
      dn[i] = next >= target;
    });

  return (
    <Card className="mb-3">
      <h2 className="font-black text-green mb-3 flex items-center gap-2">
        {which === 'morning' ? <Sun size={18} className="text-gold" /> : <Moon size={18} className="text-gold" />}
        {which === 'morning' ? t('prayer.morning') : t('prayer.evening')}
      </h2>
      <ul className="space-y-2">
        {list.map((dh, i) => {
          const isDone = done?.[i];
          const c = counts?.[i] || 0;
          return (
            <li
              key={i}
              className={`rounded-2xl border p-3 ${isDone ? 'bg-gold-soft/50 border-gold' : 'bg-cream/40 border-line'}`}
            >
              <p dir="rtl" className="text-end font-black text-ink leading-relaxed mb-1" style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 16 }}>
                {dh.ar}
              </p>
              {lng !== 'ar' && <p className="text-xs font-bold text-muted mb-2">{lng === 'tr' ? dh.tr : dh.en}</p>}
              <button
                onClick={() => tap(i, dh.count)}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 font-black text-sm transition active:scale-[.98] ${
                  isDone ? 'bg-green text-white' : 'border-2 border-gold/60 text-green'
                }`}
              >
                {isDone ? <Check size={16} strokeWidth={3} /> : null}
                <span className="num">{c} / {dh.count}</span>
                <span className="text-muted">·</span>
                <span>{t('prayer.repeat', { n: dh.count })}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
