// طقس إسطنبول عبر Open-Meteo (مجاني، بدون مفتاح). offline-first مع كاش.
const KEY = 'weather_cache_v1';
const ISTANBUL = { lat: 41.0082, lon: 28.9784 };

export interface WeatherDay {
  code: number;
  max: number;
  min: number;
}
export interface WeatherData {
  current: { temp: number; code: number; precipitation: number };
  today: WeatherDay;
  tomorrow: WeatherDay;
  fetchedAt: string;
}

export type TempBand = 'hot' | 'mild' | 'cold';

export function tempBand(t: number): TempBand {
  if (t > 25) return 'hot';
  if (t < 15) return 'cold';
  return 'mild';
}

export function isRainy(code: number, precipitation = 0): boolean {
  return precipitation > 0 || (code >= 51 && code <= 67) || (code >= 80 && code <= 99);
}

export function weatherEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

export function weatherLabel(code: number): string {
  if (code === 0) return 'صافي';
  if (code <= 3) return 'غيوم جزئية';
  if (code <= 48) return 'ضباب';
  if (code <= 67) return 'مطر';
  if (code <= 77) return 'ثلج';
  if (code <= 82) return 'زخات مطر';
  if (code <= 86) return 'ثلج';
  return 'عواصف';
}

function readCache(): WeatherData | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WeatherData) : null;
  } catch {
    return null;
  }
}

// يقرأ المفتاح سواء weather_code أو weathercode
function code(obj: Record<string, unknown>): number {
  const v = obj?.['weather_code'] ?? obj?.['weathercode'] ?? 0;
  return Number(v) || 0;
}

export async function getWeather(force = false): Promise<WeatherData | null> {
  const cached = readCache();
  if (!force && cached && Date.now() - new Date(cached.fetchedAt).getTime() < 3 * 3600 * 1000) {
    return cached;
  }
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${ISTANBUL.lat}&longitude=${ISTANBUL.lon}` +
      `&current=temperature_2m,weather_code,precipitation` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Europe%2FIstanbul`;
    const res = await fetch(url);
    if (!res.ok) return cached;
    const j = await res.json();
    const daily = j.daily ?? {};
    const data: WeatherData = {
      current: {
        temp: Number(j.current?.temperature_2m) || 0,
        code: code(j.current),
        precipitation: Number(j.current?.precipitation) || 0,
      },
      today: {
        code: Number(daily.weather_code?.[0] ?? daily.weathercode?.[0]) || 0,
        max: Number(daily.temperature_2m_max?.[0]) || 0,
        min: Number(daily.temperature_2m_min?.[0]) || 0,
      },
      tomorrow: {
        code: Number(daily.weather_code?.[1] ?? daily.weathercode?.[1]) || 0,
        max: Number(daily.temperature_2m_max?.[1]) || 0,
        min: Number(daily.temperature_2m_min?.[1]) || 0,
      },
      fetchedAt: new Date().toISOString(),
    };
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  } catch {
    return cached;
  }
}
