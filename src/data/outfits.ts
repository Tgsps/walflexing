import type { OwnedItem } from '../types';
import type { TempBand } from '../lib/weather';

// اقتراح اللبس صار يعتمد على خزانة المستخدم الفعلية (مو جدول ثابت)
export interface OutfitPick {
  empty: boolean; // الخزانة فاضية -> اعرض رسالة «أضف ملابس»
  ids: string[]; // معرّفات القطع المقترحة من الخزانة
}

// فئات الخزانة (مفاتيح عربية ثابتة في البيانات)
const CAT_TOP = 'قمصان';
const CAT_BOTTOM = 'بنطلونات';
const CAT_LAYER = 'طبقات';
const CAT_SHOES = 'أحذية';

/**
 * يختار تنسيقاً من القطع المملوكة حسب الطقس.
 * (التصنيفات موحّدة بين الجنسين؛ الجنس محفوظ في الإعدادات لتخصيص لاحق.)
 */
export function pickOutfit(owned: OwnedItem[], band: TempBand, rain: boolean): OutfitPick {
  const active = owned.filter((o) => o.status === 'owned');
  if (active.length === 0) return { empty: true, ids: [] };

  const first = (cat: string) => active.find((o) => o.category === cat)?.id;
  const ids: string[] = [];
  if (band === 'cold' || rain) {
    const layer = first(CAT_LAYER);
    if (layer) ids.push(layer);
  }
  const top = first(CAT_TOP);
  if (top) ids.push(top);
  const bottom = first(CAT_BOTTOM);
  if (bottom) ids.push(bottom);
  const shoes = first(CAT_SHOES);
  if (shoes) ids.push(shoes);

  // لو ما في قطع بهالفئات، اعرض أول 3 قطع موجودة
  if (ids.length === 0) return { empty: false, ids: active.slice(0, 3).map((o) => o.id) };
  return { empty: false, ids };
}
