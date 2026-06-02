import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Loader2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { getRate, type FxData } from '../lib/fx';
import Card from './Card';

export default function FxCard() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const [fx, setFx] = useState<FxData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const apply = (d: FxData) => {
    setFx(d);
    if (d.fetchedAt !== data.settings.lastRateFetchedAt) {
      update((s) => {
        s.settings.previousRate = s.settings.lastRate ?? d.rate;
        s.settings.lastRate = d.rate;
        s.settings.lastRateFetchedAt = d.fetchedAt;
      });
    }
  };

  useEffect(() => {
    let alive = true;
    getRate().then((d) => {
      if (!alive) return;
      if (d) apply(d);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    const d = await getRate(true);
    if (d) apply(d);
    setRefreshing(false);
  };

  const useThisRate = () =>
    fx &&
    update((d) => {
      d.settings.exchangeRate = Math.round(fx.rate * 100) / 100;
    });

  if (loading) {
    return (
      <Card className="mb-3">
        <div className="text-sm font-bold text-muted">💱 {t('fx.loading')}</div>
      </Card>
    );
  }
  if (!fx) {
    return (
      <Card className="mb-3">
        <div className="text-sm font-bold text-muted">💱 {t('fx.error')}</div>
      </Card>
    );
  }

  const prev = data.settings.previousRate;
  const rose = prev != null && fx.rate > prev;
  const fell = prev != null && fx.rate < prev;
  const diff = prev != null ? Math.abs(fx.rate - prev) : 0;

  const applied = Math.round(fx.rate * 100) / 100 === data.settings.exchangeRate;
  const statusText = prev == null ? '' : rose ? t('fxStatus.up') : fell ? t('fxStatus.down') : t('fxStatus.stable');
  const statusColor = rose ? 'rgb(var(--danger))' : fell ? 'rgb(var(--ok))' : 'rgb(var(--muted))';

  const when = new Date(fx.fetchedAt);
  const stale = Date.now() - when.getTime() > 24 * 3600 * 1000;
  const isToday = when.toDateString() === new Date().toDateString();
  const whenLabel = isToday
    ? t('fx.todayAt', { time: `${String(when.getHours()).padStart(2, '0')}:${String(when.getMinutes()).padStart(2, '0')}` })
    : `${when.getDate()}/${when.getMonth() + 1}`;

  const bars = [7, 11, 8, 12, 9];

  return (
    <Card className="mb-3 relative">
      <div className="flex items-center justify-between mb-2">
        <span className="font-black text-green" style={{ fontSize: 16 }}>
          💱 {t('fx.title')}
        </span>
        <button
          onClick={refreshing ? undefined : applied ? refresh : useThisRate}
          className="chip flex items-center gap-1"
          style={{ padding: '5px 12px', fontSize: 12, borderColor: 'rgb(var(--gold))', color: 'rgb(var(--green))' }}
        >
          {refreshing ? (
            <>
              <Loader2 size={13} className="animate-spin" /> {t('fxStatus.updating')}
            </>
          ) : applied ? (
            <>
              <RefreshCw size={13} /> {t('fxStatus.refresh')}
            </>
          ) : (
            t('fx.useIt')
          )}
        </button>
      </div>

      <div className="flex items-end gap-2.5">
        <span className="num font-black text-ink" style={{ fontSize: 28 }}>
          $1 = {fx.rate.toFixed(2)} ₺
        </span>
        {prev != null && diff > 0 && (
          <span className="num font-black flex items-center gap-0.5" style={{ fontSize: 15, marginBottom: 4, color: statusColor }}>
            {rose ? '▲' : '▼'} {diff.toFixed(2)}
          </span>
        )}
        <div className="flex items-end gap-[3px] ltr:ml-auto rtl:mr-auto" style={{ height: 26 }} aria-hidden>
          {bars.map((h, i) => (
            <span key={i} style={{ width: 4, height: h * 2, borderRadius: 9999, background: 'rgb(var(--gold) / 0.8)' }} />
          ))}
        </div>
      </div>

      {statusText && (
        <div className="font-black mt-1" style={{ fontSize: 13, color: statusColor }}>
          {statusText}
        </div>
      )}
      <div className="num font-bold text-muted mt-0.5" style={{ fontSize: 11 }}>
        {stale ? t('fx.offline') : ''}
        {whenLabel}
      </div>
    </Card>
  );
}
