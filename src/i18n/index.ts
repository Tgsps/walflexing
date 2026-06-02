import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';
import tr from './locales/tr.json';

export const LANGS = ['en', 'ar', 'tr'] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_META: Record<Lang, { flag: string; native: string }> = {
  en: { flag: '🇬🇧', native: 'English' },
  ar: { flag: '🇸🇦', native: 'العربية' },
  tr: { flag: '🇹🇷', native: 'Türkçe' },
};

/** Read the saved language straight from storage before React mounts. */
function initialLang(): Lang {
  try {
    const raw = localStorage.getItem('istanbul_app_v1');
    if (raw) {
      const l = JSON.parse(raw)?.settings?.language;
      if (l && (LANGS as readonly string[]).includes(l)) return l as Lang;
    }
  } catch {
    /* ignore */
  }
  return 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    tr: { translation: tr },
  },
  lng: initialLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
  returnEmptyString: false,
});

export default i18n;
