import type { GroceryCategory, VariableCategory } from '../types';

export const VARIABLE_CATEGORIES: {
  key: VariableCategory;
  label: string;
  emoji: string;
}[] = [
  { key: 'entertainment', label: 'ترفيه', emoji: '🎬' },
  { key: 'coffee', label: 'قهوة', emoji: '☕' },
  { key: 'readyFood', label: 'أكل جاهز', emoji: '🍔' },
  { key: 'cigarettes', label: 'دخان', emoji: '🚬' },
  { key: 'shopping', label: 'تسوّق', emoji: '🛍️' },
  { key: 'unexpected', label: 'غير متوقّع', emoji: '❓' },
];

export const VARIABLE_CAT_MAP: Record<
  VariableCategory,
  { label: string; emoji: string }
> = Object.fromEntries(
  VARIABLE_CATEGORIES.map((c) => [c.key, { label: c.label, emoji: c.emoji }]),
) as Record<VariableCategory, { label: string; emoji: string }>;

export const GROCERY_CATEGORIES: {
  key: GroceryCategory;
  label: string;
  emoji: string;
}[] = [
  { key: 'protein', label: 'البروتين', emoji: '💪' },
  { key: 'basics', label: 'الأساسيات', emoji: '🧺' },
  { key: 'vegetables', label: 'الخضار', emoji: '🥦' },
  { key: 'fruits', label: 'الفواكه', emoji: '🍓' },
];
