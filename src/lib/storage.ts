import type { AppData } from '../types';
import { createSeedData, DATA_VERSION } from '../data/seed';

const KEY = 'istanbul_app_v1';

/** يدمج البيانات المخزّنة مع البذور لضمان وجود كل المفاتيح بعد التحديثات. */
function ensureShape(stored: Partial<AppData> | null): AppData {
  const seed = createSeedData();
  if (!stored || typeof stored !== 'object') return seed;
  return {
    version: DATA_VERSION,
    settings: { ...seed.settings, ...stored.settings },
    fixedExpenses: stored.fixedExpenses ?? seed.fixedExpenses,
    variableExpenses: stored.variableExpenses ?? seed.variableExpenses,
    prices: stored.prices ?? seed.prices,
    groceries: stored.groceries ?? seed.groceries,
    shopping: stored.shopping ?? seed.shopping,
    meals: stored.meals ?? seed.meals,
    workout: {
      schedule: stored.workout?.schedule ?? seed.workout.schedule,
      log: stored.workout?.log ?? seed.workout.log,
      weightLog: stored.workout?.weightLog ?? seed.workout.weightLog,
    },
    notes: stored.notes ?? seed.notes,
    wardrobe: {
      owned: stored.wardrobe?.owned ?? seed.wardrobe.owned,
      wishlist: stored.wardrobe?.wishlist ?? seed.wardrobe.wishlist,
    },
    monthlyHistory: stored.monthlyHistory ?? seed.monthlyHistory,
  };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createSeedData();
    return ensureShape(JSON.parse(raw));
  } catch (err) {
    console.warn('فشل قراءة البيانات المحفوظة، سيتم استخدام البيانات الأولية.', err);
    return createSeedData();
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (err) {
    console.error('فشل حفظ البيانات محلياً.', err);
  }
}

export function clearData(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** للتحقّق من صحة ملف الاستيراد */
export function isValidImport(obj: unknown): obj is AppData {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.settings === 'object' &&
    Array.isArray(o.fixedExpenses) &&
    Array.isArray(o.prices) &&
    Array.isArray(o.groceries)
  );
}

export { KEY as STORAGE_KEY };
