import type { AppData, GroceryCategory, VariableExpense } from '../types';
import { WEEK_DAYS } from '../data/seed';

// ---- فلاتر التاريخ ----------------------------------------------------------
export type DateFilter = 'today' | 'week' | 'month';

export function isSameMonth(iso: string, ref = new Date()): boolean {
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export function isToday(iso: string, ref = new Date()): boolean {
  const d = new Date(iso);
  return d.toDateString() === ref.toDateString();
}

/** بداية الأسبوع = آخر يوم سبت (الأسبوع يبدأ السبت) */
export function startOfWeek(ref = new Date()): Date {
  const d = new Date(ref);
  d.setHours(0, 0, 0, 0);
  // getDay: 6 = السبت
  const diff = (d.getDay() + 1) % 7; // عدد الأيام منذ آخر سبت
  d.setDate(d.getDate() - diff);
  return d;
}

export function isThisWeek(iso: string, ref = new Date()): boolean {
  const start = startOfWeek(ref);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  const d = new Date(iso);
  return d >= start && d < end;
}

export function filterByDate(items: VariableExpense[], filter: DateFilter): VariableExpense[] {
  switch (filter) {
    case 'today':
      return items.filter((e) => isToday(e.date));
    case 'week':
      return items.filter((e) => isThisWeek(e.date));
    case 'month':
    default:
      return items.filter((e) => isSameMonth(e.date));
  }
}

/** خريطة: اسم اليوم العربي -> تاريخ هذا اليوم في الأسبوع الحالي (ISO) */
export function currentWeekDates(ref = new Date()): Record<string, string> {
  const start = startOfWeek(ref);
  const map: Record<string, string> = {};
  WEEK_DAYS.forEach((day, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    map[day] = d.toISOString().slice(0, 10);
  });
  return map;
}

// ---- إجماليات المصاريف ------------------------------------------------------
export function totalFixed(data: AppData): number {
  return data.fixedExpenses.reduce((s, e) => s + (e.amountTRY || 0), 0);
}

export function totalVariableMonth(data: AppData): number {
  return data.variableExpenses
    .filter((e) => isSameMonth(e.date))
    .reduce((s, e) => s + (e.amountTRY || 0), 0);
}

/** مجموع أسعار المشتريات المعلّمة (✔) عبر كل الأسابيع */
export function totalCheckedGroceries(data: AppData): number {
  const priceById = new Map(data.groceries.map((g) => [g.id, g.priceTRY]));
  let total = 0;
  for (const week of data.shopping.weeks) {
    for (const id of week.checkedIds) total += priceById.get(id) ?? 0;
  }
  return total;
}

export interface DashboardTotals {
  salaryUSD: number;
  rate: number;
  salaryTRY: number;
  fixed: number;
  variable: number;
  groceries: number;
  spent: number;
  remaining: number;
  spentPercent: number;
}

export function computeTotals(data: AppData): DashboardTotals {
  const salaryUSD = data.settings.salaryUSD || 0;
  const rate = data.settings.exchangeRate || 0;
  const salaryTRY = salaryUSD * rate;
  const fixed = totalFixed(data);
  const variable = totalVariableMonth(data);
  const groceries = totalCheckedGroceries(data);
  const spent = fixed + variable + groceries;
  const remaining = salaryTRY - spent;
  const spentPercent = salaryTRY > 0 ? (spent / salaryTRY) * 100 : 0;
  return { salaryUSD, rate, salaryTRY, fixed, variable, groceries, spent, remaining, spentPercent };
}

export type ProgressLevel = 'ok' | 'warn' | 'danger';

export function progressLevel(percent: number): ProgressLevel {
  if (percent > 90) return 'danger';
  if (percent >= 70) return 'warn';
  return 'ok';
}

export const PROGRESS_COLOR: Record<ProgressLevel, string> = {
  ok: '#2E9E6B',
  warn: '#E0A92E',
  danger: '#D9534F',
};

// مجموع المصاريف المتغيّرة لكل فئة (هذا الشهر)
export function variableByCategory(data: AppData): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of data.variableExpenses.filter((x) => isSameMonth(x.date))) {
    out[e.category] = (out[e.category] || 0) + (e.amountTRY || 0);
  }
  return out;
}

export function checkedGroceriesByCategory(data: AppData): Record<GroceryCategory, number> {
  const out: Record<GroceryCategory, number> = {
    protein: 0,
    basics: 0,
    vegetables: 0,
    fruits: 0,
  };
  const byId = new Map(data.groceries.map((g) => [g.id, g]));
  for (const week of data.shopping.weeks) {
    for (const id of week.checkedIds) {
      const g = byId.get(id);
      if (g) out[g.category] += g.priceTRY;
    }
  }
  return out;
}
