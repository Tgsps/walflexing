import type {
  AppData,
  FixedExpense,
  GroceryCategory,
  MonthlySnapshot,
  VariableExpense,
} from '../types';
import { WEEK_DAYS } from '../data/seed';

export function monthKey(ref = new Date()): string {
  return `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}`;
}

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

/** مجموع ما صُرف على الملابس هذا الشهر (القطع المملوكة المشتراة هذا الشهر) */
export function clothingThisMonth(data: AppData): number {
  return data.wardrobe.owned
    .filter((o) => o.purchaseDate && isSameMonth(o.purchaseDate))
    .reduce((s, o) => s + (o.pricePaid || 0), 0);
}

export interface DashboardTotals {
  salaryUSD: number;
  rate: number;
  salaryTRY: number;
  fixed: number;
  variable: number; // المتغيّرة الصافية
  groceries: number;
  clothing: number;
  variablePlusClothing: number; // ما يُعرض في بطاقة «متوقّعة»
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
  const clothing = clothingThisMonth(data);
  const variablePlusClothing = variable + clothing;
  const spent = fixed + variablePlusClothing + groceries;
  const remaining = salaryTRY - spent;
  const spentPercent = salaryTRY > 0 ? (spent / salaryTRY) * 100 : 0;
  return {
    salaryUSD,
    rate,
    salaryTRY,
    fixed,
    variable,
    groceries,
    clothing,
    variablePlusClothing,
    spent,
    remaining,
    spentPercent,
  };
}

// ---- تذكيرات الفواتير -------------------------------------------------------
export interface BillReminder {
  expense: FixedExpense;
  daysUntil: number; // سالب = متأخّرة
  paid: boolean;
}

/** الفواتير الثابتة غير المدفوعة هذا الشهر والمستحقّة خلال ≤ 3 أيام أو متأخّرة. */
export function upcomingBills(data: AppData, ref = new Date()): BillReminder[] {
  const key = monthKey(ref);
  const today = new Date(ref);
  today.setHours(0, 0, 0, 0);
  const out: BillReminder[] = [];
  for (const e of data.fixedExpenses) {
    if (!e.dueDay) continue;
    const paid = e.paidMonth === key;
    if (paid) continue;
    const due = new Date(today.getFullYear(), today.getMonth(), e.dueDay);
    due.setHours(0, 0, 0, 0);
    const daysUntil = Math.round((due.getTime() - today.getTime()) / 86400000);
    if (daysUntil <= 3) out.push({ expense: e, daysUntil, paid });
  }
  return out.sort((a, b) => a.daysUntil - b.daysUntil);
}

// ---- حاسبة اليوم ------------------------------------------------------------
export interface DailyAllowance {
  perDay: number;
  daysLeft: number;
  level: ProgressLevel;
}

export function dailyAllowance(remaining: number, salaryTRY: number, ref = new Date()): DailyAllowance {
  const daysInMonth = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(1, daysInMonth - ref.getDate() + 1);
  const perDay = remaining / daysLeft;
  let level: ProgressLevel = 'ok';
  if (remaining <= 0) level = 'danger';
  else {
    const ideal = salaryTRY > 0 ? salaryTRY / daysInMonth : perDay;
    const ratio = ideal > 0 ? perDay / ideal : 1;
    level = ratio >= 0.7 ? 'ok' : ratio >= 0.4 ? 'warn' : 'danger';
  }
  return { perDay, daysLeft, level };
}

// ---- لقطة الشهر -------------------------------------------------------------
export function snapshotForCurrentMonth(data: AppData, ref = new Date()): MonthlySnapshot {
  return {
    month: monthKey(ref),
    fixed: totalFixed(data),
    variable: totalVariableMonth(data),
    shopping: totalCheckedGroceries(data),
    clothing: clothingThisMonth(data),
    salary: (data.settings.salaryUSD || 0) * (data.settings.exchangeRate || 0),
  };
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
