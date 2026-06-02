import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shirt } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { getWeather, tempBand, isRainy, weatherEmoji, type WeatherData } from '../lib/weather';
import { pickOutfit } from '../data/outfits';
import { tWeatherCond, tOwnedName } from '../i18n/content';
import Card from './Card';

export default function WeatherCard() {
  const { t } = useTranslation();
  const { data } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

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
  const outfit = pickOutfit(data.wardrobe.owned, band, rain);
  const names = outfit.ids
    .map((id) => {
      const item = data.wardrobe.owned.find((o) => o.id === id);
      return item ? tOwnedName(id, t, item.name) : '';
    })
    .filter(Boolean);

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

      {outfit.empty ? (
        <div style={{ background: 'rgb(var(--gold-soft) / 0.6)', borderRadius: 14, padding: 12 }}>
          <p className="text-[13px] font-bold text-ink mb-2">{t('weatherEmpty.msg')}</p>
          <Link to="/clothes" className="btn-gold inline-flex items-center gap-2 text-sm py-2 px-4">
            <Shirt size={16} /> {t('weatherEmpty.btn')}
          </Link>
        </div>
      ) : (
        <div style={{ background: 'rgb(var(--gold-soft) / 0.6)', borderRadius: 14, padding: 12 }}>
          <div className="text-[13px] font-bold text-green mb-1">{t('weather.outfit')}</div>
          <div className="font-black text-ink">{names.join(' · ')}</div>
        </div>
      )}
    </Card>
  );
}
