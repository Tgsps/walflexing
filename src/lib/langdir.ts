import type { Lang } from '../i18n';

/** Sets <html lang> + dir; the CSS keys font + alignment off these. */
export function applyLangDir(lang: Lang): void {
  const el = document.documentElement;
  el.lang = lang;
  el.dir = lang === 'ar' ? 'rtl' : 'ltr';
}
