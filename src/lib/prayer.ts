import type { PrayerTimings } from '../types';

export const PRAYER_ORDER: (keyof PrayerTimings)[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
export const PRAYER_KEY: Record<keyof PrayerTimings, string> = {
  Fajr: 'fajr',
  Sunrise: 'sunrise',
  Dhuhr: 'dhuhr',
  Asr: 'asr',
  Maghrib: 'maghrib',
  Isha: 'isha',
};

/** Aladhan — method 13 = Diyanet (Turkey). offline-friendly: caller caches the result. */
export async function fetchPrayerTimes(lat: number, lng: number): Promise<PrayerTimings | null> {
  try {
    const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=13`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const j = await res.json();
    const ti = j?.data?.timings;
    if (!ti) return null;
    const clean = (s: string) => (s || '').split(' ')[0];
    return {
      Fajr: clean(ti.Fajr),
      Sunrise: clean(ti.Sunrise),
      Dhuhr: clean(ti.Dhuhr),
      Asr: clean(ti.Asr),
      Maghrib: clean(ti.Maghrib),
      Isha: clean(ti.Isha),
    };
  } catch {
    return null;
  }
}

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** الصلاة القادمة + الدقائق المتبقّية لها */
export function nextPrayer(timings: PrayerTimings, now = new Date()): { name: keyof PrayerTimings; minutesUntil: number } {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const prayers: (keyof PrayerTimings)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  for (const p of prayers) {
    const m = toMin(timings[p]);
    if (m > nowMin) return { name: p, minutesUntil: m - nowMin };
  }
  return { name: 'Fajr', minutesUntil: toMin(timings.Fajr) + 1440 - nowMin };
}

/** صياغة العدّ التنازلي حسب اللغة: 2h 14m / 2س 14د / 2sa 14dk */
export function fmtCountdown(minutes: number, lang: string): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const u = lang === 'ar' ? ['س', 'د'] : lang === 'tr' ? ['sa', 'dk'] : ['h', 'm'];
  return h > 0 ? `${h}${u[0]} ${m}${u[1]}` : `${m}${u[1]}`;
}
