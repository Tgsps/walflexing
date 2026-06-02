import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { computeTotals, isToday, isSameMonth } from '../lib/calc';
import { fmtTRY, todayISODate } from '../lib/format';
import { JS_DAY_TO_AR } from '../data/seed';
import { getWeather, weatherEmoji, tempBand, isRainy, type WeatherData } from '../lib/weather';
import { suggestOutfit } from '../data/outfits';
import { tWeatherCond } from '../i18n/content';

function shouldAutoOpen(lastDismissed: string | undefined): boolean {
  const today = todayISODate();
  if (lastDismissed === today) return false;
  const h = new Date().getHours();
  return h >= 18 || h < 5; // end of day
}

export default function EndOfDayModal() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const [open, setOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (shouldAutoOpen(data.settings.lastDaySummaryDismissed)) setOpen(true);
    const handler = () => setOpen(true);
    window.addEventListener('show-day-summary', handler);
    return () => window.removeEventListener('show-day-summary', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (open && !weather) getWeather().then(setWeather);
  }, [open, weather]);

  if (!open) return null;

  const tot = computeTotals(data);
  const todaySpend =
    data.variableExpenses.filter((e) => isToday(e.date)).reduce((s, e) => s + e.amountTRY, 0) +
    data.wardrobe.owned
      .filter((o) => o.purchaseDate && isToday(o.purchaseDate) && isSameMonth(o.purchaseDate))
      .reduce((s, o) => s + (o.pricePaid || 0), 0);

  const todayDate = todayISODate();
  const todayDay = JS_DAY_TO_AR[new Date().getDay()];
  const workoutDone = data.workout.log.some((l) => l.date === todayDate && l.done);
  const enabledMeds = data.medicines.filter((m) => m.enabled);
  const vitaminsDone = enabledMeds.length > 0 && enabledMeds.every((m) => m.lastTakenDate === todayDate);

  const toggleWorkout = () =>
    update((d) => {
      const e = d.workout.log.find((l) => l.date === todayDate);
      if (e) e.done = !e.done;
      else d.workout.log.push({ date: todayDate, day: todayDay, done: true });
    });

  const toggleVitamins = () =>
    update((d) => {
      const allDone = d.medicines.filter((m) => m.enabled).every((m) => m.lastTakenDate === todayDate);
      d.medicines.forEach((m) => {
        if (m.enabled) m.lastTakenDate = allDone ? undefined : todayDate;
      });
    });

  const dismiss = () => {
    update((d) => {
      d.settings.lastDaySummaryDismissed = todayDate;
    });
    setOpen(false);
  };

  let tomorrowOutfit = '';
  if (weather) {
    const band = tempBand(weather.tomorrow.max);
    const rain = isRainy(weather.tomorrow.code);
    tomorrowOutfit = t(`outfits.${suggestOutfit(band, rain, 'casual', data.wardrobe.owned).textKey}`);
  }

  return (
    <div className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={dismiss} />
      <div className="relative w-full sm:max-w-md bg-cream rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slideup nav-safe overflow-hidden max-h-[88vh] overflow-y-auto">
        <div className="bg-green text-white px-4 py-4 flex items-center justify-between">
          <h2 className="font-black text-lg">{t('endOfDay.title')}</h2>
          <button onClick={dismiss} className="w-9 h-9 grid place-items-center rounded-full bg-white/15" aria-label={t('common.close')}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card rounded-2xl border border-line p-3 text-center">
              <div className="text-xs text-muted font-bold mb-1">{t('endOfDay.spentToday')}</div>
              <div className="font-black text-danger num">{fmtTRY(todaySpend)}</div>
            </div>
            <div className="bg-card rounded-2xl border border-line p-3 text-center">
              <div className="text-xs text-muted font-bold mb-1">{t('endOfDay.leftMonth')}</div>
              <div className={`font-black num ${tot.remaining < 0 ? 'text-danger' : 'text-green'}`}>{fmtTRY(tot.remaining)}</div>
            </div>
          </div>

          <SummaryToggle label={t('endOfDay.didWorkout')} done={workoutDone} onToggle={toggleWorkout} />
          <SummaryToggle label={t('endOfDay.tookVitamins')} done={vitaminsDone} onToggle={toggleVitamins} disabled={enabledMeds.length === 0} />

          {tomorrowOutfit && weather && (
            <div className="bg-gold-soft/60 rounded-2xl p-3">
              <div className="text-sm font-bold text-green mb-1">
                {t('endOfDay.tomorrow', {
                  cond: weatherEmoji(weather.tomorrow.code),
                  temp: Math.round(weather.tomorrow.max),
                  label: tWeatherCond(weather.tomorrow.code, t),
                })}
              </div>
              <div className="font-bold text-ink text-sm">👕 {tomorrowOutfit}</div>
            </div>
          )}

          <button onClick={dismiss} className="btn-primary w-full">
            {t('endOfDay.goodNight')}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryToggle({ label, done, onToggle, disabled }: { label: string; done: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={disabled ? undefined : onToggle}
      className={`w-full flex items-center justify-between rounded-2xl border p-3 transition ${done ? 'bg-green text-white border-green' : 'bg-card border-line text-ink'} ${disabled ? 'opacity-50' : ''}`}
    >
      <span className="font-bold">{label}</span>
      <span className={`w-7 h-7 rounded-full grid place-items-center border-2 ${done ? 'bg-gold border-gold text-green' : 'border-line text-transparent'}`}>
        <Check size={16} strokeWidth={3} />
      </span>
    </button>
  );
}
