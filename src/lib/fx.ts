// سعر صرف USD→TRY عبر Frankfurter (مجاني، بدون مفتاح). offline-first مع كاش.
const KEY = 'fx_cache_v1';

export interface FxData {
  rate: number;
  date: string; // تاريخ السعر من الـ API
  fetchedAt: string; // وقت الجلب المحلي
}

function readCache(): FxData | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FxData) : null;
  } catch {
    return null;
  }
}

export async function getRate(force = false): Promise<FxData | null> {
  const cached = readCache();
  if (!force && cached && Date.now() - new Date(cached.fetchedAt).getTime() < 24 * 3600 * 1000) {
    return cached;
  }
  try {
    const res = await fetch('https://api.frankfurter.dev/v2/rates?base=USD&quotes=TRY');
    if (!res.ok) return cached;
    const j = await res.json();
    const rate = Number(j?.rates?.TRY);
    if (!rate) return cached;
    const data: FxData = { rate, date: j.date ?? '', fetchedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  } catch {
    return cached;
  }
}
