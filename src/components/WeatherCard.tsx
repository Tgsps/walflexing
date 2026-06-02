import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppContext';
import { getWeather, tempBand, isRainy, weatherEmoji, type WeatherData } from '../lib/weather';
import { suggestOutfit, OCCASIONS, type Occasion } from '../data/outfits';
import { tWeatherCond, tOwnedName } from '../i18n/content';
import Card from './Card';

export default function WeatherCard() {
  const { t } = useTranslation();
  const { data } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [occasion, setOccasion] = useState<Occasion>('casual');

  useEffect(() => {
    let alive = true;
    getWeather().then((w) => {
      if (alive) {
        setWeather(w);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <Card className="mb-3">
        <div className="text-sm font-bold text-muted">{t('weather.loading')}</div>
      </Card>
    );
  }
  if (!weather) {
    return (
      <Card className="mb-3">
        <div className="text-sm font-bold text-muted">{t('weather.error')}</div>
      </Card>
    );
  }

  const temp = Math.round(weather.current.temp);
  const band = tempBand(weather.current.temp);
  const rain = isRainy(weather.current.code, weather.current.precipitation);
  const outfit = suggestOutfit(band, rain, occasion, data.wardrobe.owned);
  const haveNames = outfit.haveIds.map((id) => {
    const item = data.wardrobe.owned.find((o) => o.id === id);
    return item ? tOwnedName(id, t, item.name) : '';
  });

  return (
    <Card className="mb-3">
      <div className="flex items-center gap-2.5 mb-3">
        <span style={{ fontSize: 34 }}>{weatherEmoji(weather.current.code)}</span>
        <div>
          <div className="font-black text-green" style={{ fontSize: 15 }}>
            {t('weather.now', { cond: tWeatherCond(weather.current.code, t) })}
          </div>
          <div className="num text-xs font-bold text-muted">
            {t('weather.tempLine', { temp, hi: Math.round(weather.today.max), lo: Math.round(weather.today.min) })}
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3 pb-0.5">
        {OCCASIONS.map((o) => (
          <button
            key={o.key}
            onClick={() => setOccasion(o.key)}
            className={`chip shrink-0 ${occasion === o.key ? 'bg-green text-white border-green' : ''}`}
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            {o.emoji} {t(`occasions.${o.key}`)}
          </button>
        ))}
      </div>

      <div style={{ background: 'rgb(var(--gold-soft) / 0.6)', borderRadius: 14, padding: 12 }}>
        <div className="text-[13px] font-bold text-green mb-1">{t('weather.outfit')}</div>
        <div className="font-black text-ink">{t(`outfits.${outfit.textKey}`)}</div>
        {haveNames.length > 0 && (
          <div className="text-xs font-bold text-muted mt-1">
            {t('weather.fromWardrobe', { items: haveNames.join(' · ') })}
          </div>
        )}
      </div>
    </Card>
  );
}
