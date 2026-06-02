import { useEffect, useState } from 'react';
import { useApp } from '../state/AppContext';
import { getWeather, tempBand, isRainy, weatherEmoji, weatherLabel, type WeatherData } from '../lib/weather';
import { suggestOutfit, OCCASIONS, type Occasion } from '../data/outfits';
import Card from './Card';

export default function WeatherCard() {
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
        <div className="text-sm font-bold text-muted">⛅ جاري جلب طقس إسطنبول…</div>
      </Card>
    );
  }
  if (!weather) {
    return (
      <Card className="mb-3">
        <div className="text-sm font-bold text-muted">⛅ تعذّر جلب الطقس — تأكد من الإنترنت.</div>
      </Card>
    );
  }

  const temp = Math.round(weather.current.temp);
  const band = tempBand(weather.current.temp);
  const rain = isRainy(weather.current.code, weather.current.precipitation);
  const outfit = suggestOutfit(band, rain, occasion, data.wardrobe.owned);

  return (
    <Card className="mb-3">
      <div className="flex items-center gap-2.5 mb-3">
        <span style={{ fontSize: 34 }}>{weatherEmoji(weather.current.code)}</span>
        <div>
          <div className="font-black text-green" style={{ fontSize: 15 }}>
            إسطنبول الآن · {weatherLabel(weather.current.code)}
          </div>
          <div className="num text-xs font-bold text-muted">
            {temp}° · أعلى {Math.round(weather.today.max)}° / أدنى {Math.round(weather.today.min)}°
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
            {o.emoji} {o.label}
          </button>
        ))}
      </div>

      <div style={{ background: 'rgb(var(--gold-soft) / 0.6)', borderRadius: 14, padding: 12 }}>
        <div className="text-[13px] font-bold text-green mb-1">👕 لبس مناسب:</div>
        <div className="font-black text-ink">{outfit.text}</div>
        {outfit.haveItems.length > 0 && (
          <div className="text-xs font-bold text-muted mt-1">من خزانتك: {outfit.haveItems.join(' · ')}</div>
        )}
      </div>
    </Card>
  );
}
