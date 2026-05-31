import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
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
  const fell = prev != null && fx.rate < prev;
  const diff = prev != null ? fx.rate - prev : 0;

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

  return (
    <Card className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="font-black text-green">💱 سعر الصرف اليوم</span>
        <button onClick={useThisRate} className="text-xs font-bold text-green flex items-center gap-1 border-2 border-gold/70 rounded-lg px-2 py-1">
          <RefreshCw size={13} /> استخدمه
        </button>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-black text-ink num">
          $1 = {fx.rate.toFixed(2)} ₺
        </span>
        {prev != null && diff !== 0 && (
          <span className={`flex items-center gap-0.5 text-sm font-black num mb-1 ${rose ? 'text-danger' : 'text-ok'}`}>
            {rose ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
            {Math.abs(diff).toFixed(2)}
          </span>
        )}
      </div>
      <div className="text-xs font-bold text-muted mt-1 num">
        {stale ? '⚠️ أوفلاين — آخر قيمة محفوظة · ' : 'آخر تحديث: '}
        {whenLabel}
        {rose && ' · الدولار ارتفع'}
        {fell && ' · الدولار نزل'}
      </div>
    </Card>
  );
}
