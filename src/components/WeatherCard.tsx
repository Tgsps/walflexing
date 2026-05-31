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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{weatherEmoji(weather.current.code)}</span>
          <div>
            <div className="font-black text-green">إسطنبول الآن · {weatherLabel(weather.current.code)}</div>
            <div className="text-xs text-muted font-bold num">
              {temp}° · أعلى {Math.round(weather.today.max)}° / أدنى {Math.round(weather.today.min)}°
            </div>
          </div>
        </div>
        <select
          value={occasion}
          onChange={(e) => setOccasion(e.target.value as Occasion)}
          className="bg-cream/60 border-2 border-line rounded-lg px-2 py-1.5 text-sm font-bold text-green focus:border-gold focus:outline-none"
        >
          {OCCASIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.emoji} {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gold-soft/60 rounded-xl p-3">
        <div className="text-sm font-bold text-green mb-1">👕 لبس مناسب:</div>
        <div className="font-black text-ink">{outfit.text}</div>
        {outfit.haveItems.length > 0 && (
          <div className="text-xs font-bold text-muted mt-1">من خزانتك: {outfit.haveItems.join(' · ')}</div>
        )}
      </div>
    </Card>
  );
}
