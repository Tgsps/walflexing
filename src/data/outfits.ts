import type { OwnedItem } from '../types';
import type { TempBand } from '../lib/weather';

export type Occasion = 'formal' | 'casual' | 'outing' | 'sport';

export const OCCASIONS: { key: Occasion; label: string; emoji: string }[] = [
  { key: 'formal', label: 'رسمي', emoji: '👔' },
  { key: 'casual', label: 'كاجوال', emoji: '🧥' },
  { key: 'outing', label: 'طلعة', emoji: '🌆' },
  { key: 'sport', label: 'رياضي', emoji: '🏃' },
];

// جدول الاقتراحات (طقس × مناسبة)
const TABLE: Record<TempBand | 'rain', Record<Occasion, string>> = {
  hot: {
    formal: 'قميص أبيض + بنطلون',
    casual: 'قميص زيتي + جينز',
    outing: 'قميص أبيض مفتوح + جينز',
    sport: 'تيشيرت + شورت',
  },
  mild: {
    formal: 'بليزر + قميص أبيض',
    casual: 'قميص أسود + جينز',
    outing: 'قميص + جينز + سنيكر',
    sport: 'تيشيرت + بنطلون رياضي',
  },
  cold: {
    formal: 'بليزر + كنزة + بنطلون',
    casual: 'كنزة داكنة + جينز',
    outing: 'كنزة + جينز + چلسي بوت',
    sport: 'هودي + بنطلون رياضي',
  },
  rain: {
    formal: 'بليزر + قميص + حذاء جيد ☔',
    casual: 'كنزة + جينز + چلسي بوت ☔',
    outing: 'كنزة + جينز + چلسي بوت ☔',
    sport: 'هودي مضاد للمطر ☔',
  },
};

// كلمات مفتاحية لمطابقة القطع الموجودة فعلاً بالخزانة
const KEYWORDS: Record<Occasion, string[]> = {
  formal: ['بليزر', 'قميص', 'أبيض', 'بنطلون'],
  casual: ['قميص', 'جينز', 'كنزة'],
  outing: ['قميص', 'جينز', 'سنيكر', 'بوت', 'كنزة'],
  sport: ['تيشيرت', 'سنيكر', 'رياضي', 'هودي', 'شورت'],
};

export interface OutfitSuggestion {
  text: string;
  haveItems: string[]; // قطع موجودة بالخزانة تناسب المناسبة
  isRain: boolean;
}

export function suggestOutfit(
  band: TempBand,
  isRain: boolean,
  occasion: Occasion,
  owned: OwnedItem[],
): OutfitSuggestion {
  const key = isRain ? 'rain' : band;
  const text = TABLE[key][occasion];
  const kws = KEYWORDS[occasion];
  const haveItems = owned
    .filter((o) => o.status === 'owned')
    .filter((o) => kws.some((k) => o.name.includes(k)))
    .map((o) => o.name)
    .slice(0, 4);
  return { text, haveItems, isRain };
}
