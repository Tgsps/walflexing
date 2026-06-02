import type { OwnedItem } from '../types';
import type { TempBand } from '../lib/weather';

export type Occasion = 'formal' | 'casual' | 'outing' | 'sport';

export const OCCASIONS: { key: Occasion; label: string; emoji: string }[] = [
  { key: 'formal', label: 'رسمي', emoji: '👔' },
  { key: 'casual', label: 'كاجوال', emoji: '🧥' },
  { key: 'outing', label: 'طلعة', emoji: '🌆' },
  { key: 'sport', label: 'رياضي', emoji: '🏃' },
];

// كلمات مفتاحية لمطابقة القطع الموجودة فعلاً بالخزانة
const KEYWORDS: Record<Occasion, string[]> = {
  formal: ['بليزر', 'قميص', 'أبيض', 'بنطلون'],
  casual: ['قميص', 'جينز', 'كنزة'],
  outing: ['قميص', 'جينز', 'سنيكر', 'بوت', 'كنزة'],
  sport: ['تيشيرت', 'سنيكر', 'رياضي', 'هودي', 'شورت'],
};

export interface OutfitSuggestion {
  textKey: string; // مفتاح الترجمة outfits.<band|rain>_<occasion>
  haveIds: string[]; // معرّفات قطع موجودة بالخزانة تناسب المناسبة
  isRain: boolean;
}

export function suggestOutfit(
  band: TempBand,
  isRain: boolean,
  occasion: Occasion,
  owned: OwnedItem[],
): OutfitSuggestion {
  const key = isRain ? 'rain' : band;
  const kws = KEYWORDS[occasion];
  const haveIds = owned
    .filter((o) => o.status === 'owned')
    .filter((o) => kws.some((k) => o.name.includes(k)))
    .map((o) => o.id)
    .slice(0, 4);
  return { textKey: `${key}_${occasion}`, haveIds, isRain };
}
