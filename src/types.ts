// ---- Data model -------------------------------------------------------------

export interface Settings {
  salaryUSD: number;
  exchangeRate: number; // ₺ per 1 $
  monthlyClothingBudgetTRY: number; // ميزانية الملابس الشهرية (افتراضي 0)
}

export interface FixedExpense {
  id: string;
  name: string;
  emoji: string;
  amountTRY: number;
  dueDay?: number; // optional reminder day of month
  paidMonth?: string; // "2026-05" => مدفوعة لهذا الشهر
}

export type VariableCategory =
  | 'entertainment'
  | 'coffee'
  | 'readyFood'
  | 'cigarettes'
  | 'shopping'
  | 'unexpected';

export interface VariableExpense {
  id: string;
  category: VariableCategory;
  amountTRY: number;
  date: string; // ISO date-time
  note?: string;
}

export type GroceryCategory = 'protein' | 'basics' | 'vegetables' | 'fruits';

/** Reference unit-price table (editable in Settings). */
export interface PriceItem {
  id: string;
  emoji: string;
  name: string;
  unit: string;
  priceTRY: number;
}

/** Monthly grocery bundle used by the weekly checklist. */
export interface GroceryItem {
  id: string;
  emoji: string;
  name: string;
  qty: string;
  priceTRY: number;
  category: GroceryCategory;
}

export interface ShoppingWeek {
  week: number; // 1..4
  checkedIds: string[]; // grocery item ids checked this week
}

export type MealSlot = 'breakfast' | 'lunch' | 'dinner';

export interface MealDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  recipes: Partial<Record<MealSlot, string>>; // recipe ids when available
  done: Record<MealSlot, boolean>;
}

export interface MealWeek {
  week: number;
  days: MealDay[];
}

export interface WorkoutDay {
  day: string;
  focus: string;
  rest: boolean;
}

export interface WorkoutLogEntry {
  date: string; // ISO date (yyyy-mm-dd)
  day: string;
  done: boolean;
}

export interface Recipe {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  time: string;
  ingredients: string[];
  steps: string[];
  tip: string;
}

// ---- المرحلة الثانية -------------------------------------------------------

export type WardrobeCategory = 'قمصان' | 'بنطلونات' | 'طبقات' | 'أحذية' | 'إكسسوار';
export type WardrobeStatus = 'owned' | 'sold' | 'damaged';
export type Priority = 'high' | 'medium' | 'low';

export interface OwnedItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  color: string;
  store?: string;
  pricePaid?: number;
  purchaseDate?: string; // ISO — يُحتسب ضمن مصاريف الشهر
  status: WardrobeStatus;
}

export interface WishlistItem {
  id: string;
  name: string;
  priority: Priority;
  store: string;
  budgetMinTRY: number;
  budgetMaxTRY: number;
  bought: boolean;
}

export interface Wardrobe {
  owned: OwnedItem[];
  wishlist: WishlistItem[];
}

export interface WeightEntry {
  date: string; // ISO date
  weightKg: number;
}

export interface MonthlySnapshot {
  month: string; // "2026-05"
  fixed: number;
  variable: number;
  shopping: number;
  clothing: number;
  salary: number;
}

export interface AppData {
  version: number;
  settings: Settings;
  fixedExpenses: FixedExpense[];
  variableExpenses: VariableExpense[];
  prices: PriceItem[];
  groceries: GroceryItem[];
  shopping: { weeks: ShoppingWeek[] };
  meals: { weeks: MealWeek[] };
  workout: { schedule: WorkoutDay[]; log: WorkoutLogEntry[]; weightLog: WeightEntry[] };
  notes: string[];
  wardrobe: Wardrobe;
  monthlyHistory: MonthlySnapshot[];
}
