import { useEffect, useState } from 'react';
import { useApp } from '../state/AppContext';
import { getRate, type FxData } from '../lib/fx';
import Card from './Card';

export default function FxCard() {
  const { data, update } = useApp();
  const [fx, setFx] = useState<FxData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getRate().then((d) => {
      if (!alive) return;
      setFx(d);
      setLoading(false);
      if (d && d.fetchedAt !== data.settings.lastRateFetchedAt) {
        update((s) => {
          s.settings.previousRate = s.settings.lastRate ?? d.rate;
          s.settings.lastRate = d.rate;
          s.settings.lastRateFetchedAt = d.fetchedAt;
        });
      }
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Card className="mb-3">
        <div className="text-sm font-bold text-muted">💱 جاري جلب سعر الصرف…</div>
      </Card>
    );
  }
  if (!fx) {
    return (
      <Card className="mb-3">
        <div className="text-sm font-bold text-muted">💱 تعذّر جلب سعر الصرف — تأكد من الإنترنت.</div>
      </Card>
    );
  }

  const prev = data.settings.previousRate;
  const rose = prev != null && fx.rate > prev;
  const diff = prev != null ? Math.abs(fx.rate - prev) : 0;

  const stale = Date.now() - new Date(fx.fetchedAt).getTime() > 24 * 3600 * 1000;
  const when = new Date(fx.fetchedAt);
  const isToday = when.toDateString() === new Date().toDateString();
  const whenLabel = isToday
    ? `اليوم ${String(when.getHours()).padStart(2, '0')}:${String(when.getMinutes()).padStart(2, '0')}`
    : `${when.getDate()}/${when.getMonth() + 1}`;

  const useThisRate = () =>
    update((d) => {
      d.settings.exchangeRate = Math.round(fx.rate * 100) / 100;
    });

  const bars = [7, 11, 8, 12, 9];

  return (
    <Card className="mb-3 relative">
      <div className="flex items-center justify-between mb-2">
        <span className="font-black text-green" style={{ fontSize: 16 }}>
          💱 سعر الصرف اليوم
        </span>
        <button
          onClick={useThisRate}
          className="chip"
          style={{ padding: '5px 12px', fontSize: 12, borderColor: 'rgb(var(--gold))', color: 'rgb(var(--green))' }}
        >
          ↻ استخدمه
        </button>
      </div>
      <div className="flex items-end gap-2.5">
        <span className="num font-black text-ink" style={{ fontSize: 28 }}>
          $1 = {fx.rate.toFixed(2)} ₺
        </span>
        {prev != null && diff > 0 && (
          <span
            className="num font-black flex items-center gap-0.5"
            style={{ fontSize: 15, marginBottom: 4, color: rose ? 'rgb(var(--danger))' : 'rgb(var(--ok))' }}
          >
            {rose ? '▲' : '▼'} {diff.toFixed(2)}
          </span>
        )}
        <div className="flex items-end gap-[3px] mr-auto" style={{ height: 26 }} aria-hidden>
          {bars.map((h, i) => (
            <span key={i} style={{ width: 4, height: h * 2, borderRadius: 9999, background: 'rgb(var(--gold) / 0.8)' }} />
          ))}
        </div>
      </div>
      <div className="num font-bold text-muted mt-1.5" style={{ fontSize: 11 }}>
        {stale ? '⚠️ أوفلاين — آخر قيمة محفوظة · ' : ''}
        {whenLabel}
        {prev != null && diff > 0 && (rose ? ' · الدولار ارتفع' : ' · الدولار نزل')}
      </div>
    </Card>
  );
}
