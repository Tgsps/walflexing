// تنسيق الأرقام والعملات

const grouper = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

/** يعرض المبلغ بالليرة: «1,234 ₺» */
export function fmtTRY(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  return `${grouper.format(Math.round(v))} ₺`;
}

/** يعرض المبلغ بالدولار: «$27» */
export function fmtUSD(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  return `$${grouper.format(Math.round(v))}`;
}

/** نسخة دولار بكسر عشري واحد للمبالغ الصغيرة: «$3.3» */
export function fmtUSD1(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  return `$${(Math.round(v * 10) / 10).toLocaleString('en-US')}`;
}

export function toUSD(amountTRY: number, rate: number): number {
  if (!rate) return 0;
  return amountTRY / rate;
}

export function toTRY(amountUSD: number, rate: number): number {
  return amountUSD * rate;
}

/** معرّف فريد بسيط */
export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

// ---- locale-aware dates -----------------------------------------------------
// EN → M/D · AR/TR → D/M
export function fmtDayMonth(d: Date, lang: string): string {
  const day = d.getDate();
  const m = d.getMonth() + 1;
  return lang === 'en' ? `${m}/${day}` : `${day}/${m}`;
}

// EN → M/D/YYYY · AR/TR → D/M/YYYY
export function fmtFullDate(d: Date, lang: string): string {
  const day = d.getDate();
  const m = d.getMonth() + 1;
  const y = d.getFullYear();
  return lang === 'en' ? `${m}/${day}/${y}` : `${day}/${m}/${y}`;
}

/** Localized long month name via Intl. */
export function monthName(lang: string, d = new Date()): string {
  try {
    return new Intl.DateTimeFormat(lang, { month: 'long' }).format(d);
  } catch {
    return new Intl.DateTimeFormat('en', { month: 'long' }).format(d);
  }
}
