import type {
  AppData,
  FixedExpense,
  GroceryItem,
  MealDay,
  MealWeek,
  OwnedItem,
  PrayerData,
  PriceItem,
  WishlistItem,
  WorkoutDay,
} from '../types';
import { RECIPE_BY_NAME } from './recipes';

export const DATA_VERSION = 1;

// أيام الأسبوع تبدأ بالسبت (مثل ملف الـ PDF)
export const WEEK_DAYS = [
  'السبت',
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
] as const;

// getDay() => 0=أحد .. 6=سبت
export const JS_DAY_TO_AR = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

// ---- جدول الأسعار المرجعي (صفحة «الأسعار») ---------------------------------
const PRICES: PriceItem[] = [
  { id: 'p_chicken', emoji: '🍗', name: 'صدور دجاج مجمدة (فيليه)', unit: '1 كغ', priceTRY: 150 },
  { id: 'p_salmon', emoji: '🐟', name: 'سلمون مجمد شرائح', unit: '~450 غ', priceTRY: 125 },
  { id: 'p_beef', emoji: '🥩', name: 'لحمة مفرومة بقري (دانا)', unit: '1 كغ', priceTRY: 625 },
  { id: 'p_eggs', emoji: '🥚', name: 'بيض', unit: 'علبة 30 حبة', priceTRY: 110 },
  { id: 'p_cheese', emoji: '🧀', name: 'جبنة بيضاء', unit: '1 كغ', priceTRY: 209 },
  { id: 'p_milk', emoji: '🥛', name: 'حليب', unit: '1 لتر', priceTRY: 32 },
  { id: 'p_yogurt', emoji: '🥣', name: 'لبن / زبادي', unit: '1 كغ', priceTRY: 60 },
  { id: 'p_oats', emoji: '🌾', name: 'شوفان', unit: '~500 غ', priceTRY: 55 },
  { id: 'p_rice', emoji: '🍚', name: 'رز (بالدو)', unit: '2.5 كغ', priceTRY: 177 },
  { id: 'p_oliveoil', emoji: '🫒', name: 'زيت زيتون', unit: '1 لتر', priceTRY: 275 },
  { id: 'p_tomatopaste', emoji: '🥫', name: 'معجون طماطم (صلصة)', unit: 'علبة 830 غ', priceTRY: 69 },
  { id: 'p_onion', emoji: '🧅', name: 'بصل', unit: '1 كغ', priceTRY: 14 },
  { id: 'p_potato', emoji: '🥔', name: 'بطاطا', unit: '1 كغ', priceTRY: 17 },
  { id: 'p_tomato', emoji: '🍅', name: 'بندورة', unit: '1 كغ', priceTRY: 60 },
  { id: 'p_broccoli', emoji: '🥦', name: 'بروكلي', unit: '1 كغ', priceTRY: 100 },
  { id: 'p_pepper', emoji: '🫑', name: 'فلفل ملوّن', unit: 'علبة 300 غ', priceTRY: 60 },
  { id: 'p_carrot', emoji: '🥕', name: 'جزر', unit: 'علبة 350 غ', priceTRY: 13 },
  { id: 'p_cucumber', emoji: '🥒', name: 'خيار', unit: '1 كغ', priceTRY: 30 },
  { id: 'p_lemon', emoji: '🍋', name: 'ليمون', unit: '1 كغ', priceTRY: 90 },
  { id: 'p_mushroom', emoji: '🍄', name: 'مشروم (فطر)', unit: 'علبة 300 غ', priceTRY: 45 },
  { id: 'p_garlic', emoji: '🧄', name: 'ثوم', unit: '100 غ', priceTRY: 18 },
  { id: 'p_banana', emoji: '🍌', name: 'موز', unit: '1 كغ', priceTRY: 116 },
  { id: 'p_apple', emoji: '🍎', name: 'تفاح', unit: '1 كغ', priceTRY: 70 },
  { id: 'p_orange', emoji: '🍊', name: 'برتقال', unit: '1 كغ', priceTRY: 40 },
];

// ---- قائمة المشتريات الشهرية (صفحة «قائمة المشتريات») -----------------------
const GROCERIES: GroceryItem[] = [
  // البروتين — ~2.366 ₺
  { id: 'g_chicken', emoji: '🍗', name: 'صدور دجاج مجمدة', qty: '2.5 كغ', priceTRY: 375, category: 'protein' },
  { id: 'g_salmon', emoji: '🐟', name: 'سلمون مجمد', qty: '5 علب (~2.25 كغ)', priceTRY: 625, category: 'protein' },
  { id: 'g_beef', emoji: '🥩', name: 'لحمة مفرومة بقري', qty: '1 كغ', priceTRY: 625, category: 'protein' },
  { id: 'g_eggs', emoji: '🥚', name: 'بيض', qty: 'علبتين × 30', priceTRY: 220, category: 'protein' },
  { id: 'g_cheese', emoji: '🧀', name: 'جبنة بيضاء', qty: '1 كغ', priceTRY: 209, category: 'protein' },
  { id: 'g_milk', emoji: '🥛', name: 'حليب', qty: '6 لتر', priceTRY: 192, category: 'protein' },
  { id: 'g_yogurt', emoji: '🥣', name: 'لبن / زبادي', qty: '2 كغ', priceTRY: 120, category: 'protein' },
  // الأساسيات — ~1.151 ₺
  { id: 'g_oats', emoji: '🌾', name: 'شوفان', qty: 'علبتين', priceTRY: 110, category: 'basics' },
  { id: 'g_rice', emoji: '🍚', name: 'رز', qty: '2.5 كغ', priceTRY: 177, category: 'basics' },
  { id: 'g_oliveoil', emoji: '🫒', name: 'زيت زيتون', qty: '1 لتر', priceTRY: 275, category: 'basics' },
  { id: 'g_tomatopaste', emoji: '🥫', name: 'معجون طماطم', qty: 'علبة', priceTRY: 69, category: 'basics' },
  { id: 'g_spices', emoji: '🧂', name: 'بهارات (ملح، فلفل، كمون، بابريكا، أوريغانو)', qty: 'تشكيلة', priceTRY: 200, category: 'basics' },
  { id: 'g_honey', emoji: '🍯', name: 'عسل / زبدة فول سوداني', qty: 'علبة', priceTRY: 120, category: 'basics' },
  { id: 'g_bread', emoji: '🥖', name: 'خبز', qty: 'حسب الحاجة', priceTRY: 200, category: 'basics' },
  // الخضار — ~1.039 ₺
  { id: 'g_onion', emoji: '🧅', name: 'بصل', qty: '2 كغ', priceTRY: 28, category: 'vegetables' },
  { id: 'g_potato', emoji: '🥔', name: 'بطاطا', qty: '3 كغ', priceTRY: 51, category: 'vegetables' },
  { id: 'g_tomato', emoji: '🍅', name: 'بندورة', qty: '3 كغ', priceTRY: 180, category: 'vegetables' },
  { id: 'g_broccoli', emoji: '🥦', name: 'بروكلي', qty: '2 كغ', priceTRY: 200, category: 'vegetables' },
  { id: 'g_pepper', emoji: '🫑', name: 'فلفل ملوّن', qty: '~1.5 كغ', priceTRY: 180, category: 'vegetables' },
  { id: 'g_carrot', emoji: '🥕', name: 'جزر', qty: '1 كغ', priceTRY: 40, category: 'vegetables' },
  { id: 'g_cucumber', emoji: '🥒', name: 'خيار', qty: '2 كغ', priceTRY: 60, category: 'vegetables' },
  { id: 'g_lemon', emoji: '🍋', name: 'ليمون', qty: '1 كغ', priceTRY: 90, category: 'vegetables' },
  { id: 'g_mushroom', emoji: '🍄', name: 'مشروم', qty: '~600 غ', priceTRY: 90, category: 'vegetables' },
  { id: 'g_garlic', emoji: '🧄', name: 'ثوم + خضرة ورقية', qty: 'حسب الحاجة', priceTRY: 120, category: 'vegetables' },
  // الفواكه — ~452 ₺
  { id: 'g_banana', emoji: '🍌', name: 'موز', qty: '2 كغ', priceTRY: 232, category: 'fruits' },
  { id: 'g_apple', emoji: '🍎', name: 'تفاح', qty: '2 كغ', priceTRY: 140, category: 'fruits' },
  { id: 'g_orange', emoji: '🍊', name: 'برتقال', qty: '2 كغ', priceTRY: 80, category: 'fruits' },
];

// ---- مصاريف ثابتة افتراضية (قابلة للتعديل بالكامل) --------------------------
const FIXED: FixedExpense[] = [
  { id: 'f_rent', name: 'الإيجار', emoji: '🏠', amountTRY: 15000, dueDay: 1 },
  { id: 'f_water', name: 'ماء', emoji: '💧', amountTRY: 250, dueDay: 10 },
  { id: 'f_gas', name: 'غاز', emoji: '🔥', amountTRY: 500, dueDay: 10 },
  { id: 'f_electric', name: 'كهرباء', emoji: '⚡', amountTRY: 700, dueDay: 15 },
  { id: 'f_phone', name: 'هاتف', emoji: '📱', amountTRY: 300, dueDay: 20 },
  { id: 'f_internet', name: 'إنترنت', emoji: '🌐', amountTRY: 450, dueDay: 20 },
  { id: 'f_transport', name: 'مواصلات', emoji: '🚌', amountTRY: 1200 },
];

// ---- جدول الطبخات: [يوم, عشاء, فطور] لكل أسبوع ------------------------------
const LUNCH_DEFAULT = 'بقايا عشاء الأمس · أو سلطة + بروتين خفيف';

type Row = [day: string, dinner: string, breakfast: string];

const PLAN: Row[][] = [
  // الأسبوع الأول
  [
    ['السبت', 'دجاج بالثوم والزبدة + رز', 'بيض مقلي + جبنة + بندورة'],
    ['الأحد', 'سلمون بالفرن بالليمون', 'شوفان بالحليب + موز'],
    ['الإثنين', 'دجاج بالفرن مع البطاطا', 'أومليت بالخضار'],
    ['الثلاثاء', 'كفتة لحمة + رز', 'لبن + شوفان + تفاح'],
    ['الأربعاء', 'سلمون مقلي + خضار سوتيه', 'بيض مسلوق + خبز + جبنة'],
    ['الخميس', 'دجاج مقلي سريع بالفلفل', 'منمن'],
    ['الجمعة', 'يوم برا / سمك برا', 'ساندويش دجاج (من البقايا)'],
  ],
  // الأسبوع الثاني
  [
    ['السبت', 'دجاج بالليمون والبروكلي', 'أومليت بالجبنة'],
    ['الأحد', 'سلمون بالعسل والصويا + رز', 'شوفان + موز + عسل'],
    ['الإثنين', 'دجاج بالمشروم', 'بيض مخفوق + جبنة'],
    ['الثلاثاء', 'لحمة مفرومة مع البطاطا', 'لبن + تفاح + شوفان'],
    ['الأربعاء', 'سلمون بالفرن + خضار محمّر', 'منمن'],
    ['الخميس', 'دجاج مشوي متبّل + سلطة', 'بيض مسلوق + خبز + خيار'],
    ['الجمعة', 'يوم برا / سمك برا', 'بيض + بقايا دجاج'],
  ],
  // الأسبوع الثالث
  [
    ['السبت', 'دجاج بالثوم والزبدة + رز', 'شوفان بالحليب + موز'],
    ['الأحد', 'سلمون مقلي + خضار سوتيه', 'بيض مقلي + جبنة + بندورة'],
    ['الإثنين', 'دجاج مقلي سريع بالفلفل', 'أومليت بالخضار'],
    ['الثلاثاء', 'برغر لحمة + سلطة', 'لبن + شوفان + تفاح'],
    ['الأربعاء', 'سلمون بالفرن بالليمون', 'منمن'],
    ['الخميس', 'دجاج بالليمون والبروكلي', 'بيض مسلوق + خبز + جبنة'],
    ['الجمعة', 'يوم برا / سمك برا', 'ساندويش دجاج'],
  ],
  // الأسبوع الرابع
  [
    ['السبت', 'دجاج بالفرن مع البطاطا', 'أومليت بالجبنة'],
    ['الأحد', 'سلمون بالعسل والصويا + رز', 'شوفان + موز + عسل'],
    ['الإثنين', 'دجاج بالمشروم', 'بيض مخفوق + جبنة'],
    ['الثلاثاء', 'كفتة لحمة + رز', 'لبن + تفاح'],
    ['الأربعاء', 'سلمون بالفرن + خضار محمّر', 'بيض مسلوق + خيار'],
    ['الخميس', 'دجاج مشوي متبّل + سلطة', 'منمن'],
    ['الجمعة', 'يوم برا / سمك برا', 'بيض + بقايا دجاج'],
  ],
];

function buildMeals(): MealWeek[] {
  return PLAN.map((rows, i) => {
    const days: MealDay[] = rows.map(([day, dinner, breakfast]) => ({
      day,
      breakfast,
      lunch: LUNCH_DEFAULT,
      dinner,
      recipes: {
        breakfast: RECIPE_BY_NAME[breakfast],
        dinner: RECIPE_BY_NAME[dinner],
      },
      done: { breakfast: false, lunch: false, dinner: false },
    }));
    return { week: i + 1, days };
  });
}

// ---- جدول التمارين الأسبوعي (قابل للتعديل) ---------------------------------
const WORKOUT_SCHEDULE: WorkoutDay[] = [
  { day: 'السبت', focus: 'حدّده بنفسك', rest: false },
  { day: 'الأحد', focus: 'ظهر + باي + ساعد', rest: false },
  { day: 'الإثنين', focus: 'صدر + تراي', rest: false },
  { day: 'الثلاثاء', focus: 'راحة', rest: true },
  { day: 'الأربعاء', focus: 'أكتاف + بطن + ترابيس', rest: false },
  { day: 'الخميس', focus: 'أرجل', rest: false },
  { day: 'الجمعة', focus: 'راحة', rest: true },
];

// ---- خزانة الملابس (بيانات أولية قابلة للتعديل) ----------------------------
const WARDROBE_OWNED: OwnedItem[] = [
  { id: 'w_blazer_black', name: 'بليزر أسود نظيف', category: 'طبقات', color: 'أسود', status: 'owned' },
  { id: 'w_shirt_black', name: 'قميص أسود fitted كم طويل', category: 'قمصان', color: 'أسود', store: 'Tudors', status: 'owned' },
  { id: 'w_shirt_white', name: 'قميص أبيض crisp كم طويل', category: 'قمصان', color: 'أبيض', store: 'Tudors', status: 'owned' },
  { id: 'w_shirt_olive', name: 'قميص زيتي fitted', category: 'قمصان', color: 'زيتي', status: 'owned' },
  { id: 'w_jeans_dark', name: 'جينز داكن slim-straight', category: 'بنطلونات', color: 'كحلي داكن', store: 'Mavi', status: 'owned' },
  { id: 'w_sneaker_white', name: 'سنيكر أبيض مينيمَلِست', category: 'أحذية', color: 'أبيض', status: 'owned' },
  { id: 'w_belt_black', name: 'حزام أسود إبزيم فضي', category: 'إكسسوار', color: 'أسود/فضي', status: 'owned' },
  { id: 'w_watch_silver', name: 'ساعة سيلفر فضية', category: 'إكسسوار', color: 'فضي', status: 'owned' },
  { id: 'w_glasses', name: 'نظارة أوبتيكال', category: 'إكسسوار', color: 'فضي', status: 'owned' },
  { id: 'w_pocket_white', name: 'منديل جيب أبيض', category: 'إكسسوار', color: 'أبيض', status: 'owned' },
];

const WARDROBE_WISHLIST: WishlistItem[] = [
  { id: 'wl_chelsea', name: '🥾 چلسي بوت أسود', priority: 'high', store: 'FLO / Koton', budgetMinTRY: 1500, budgetMaxTRY: 3000, bought: false },
  { id: 'wl_chino_beige', name: '👖 چينو بيج slim fit', priority: 'high', store: 'GAP / Koton', budgetMinTRY: 800, budgetMaxTRY: 1500, bought: false },
  { id: 'wl_blazer_navy', name: '🧥 بليزر كحلي أو رمادي', priority: 'high', store: 'Mudo / Koton', budgetMinTRY: 1500, budgetMaxTRY: 3000, bought: false },
  { id: 'wl_shirt_white2', name: '👕 قميص أبيض إضافي', priority: 'medium', store: 'Tudors', budgetMinTRY: 500, budgetMaxTRY: 900, bought: false },
  { id: 'wl_sweater', name: '🧶 كنزة فاين نِيت داكنة', priority: 'medium', store: 'GAP / Mudo', budgetMinTRY: 800, budgetMaxTRY: 1500, bought: false },
  { id: 'wl_chino_grey', name: '👔 چينو رمادي فاتح', priority: 'low', store: 'GAP / Koton', budgetMinTRY: 800, budgetMaxTRY: 1500, bought: false },
];

// متاجر مرجعية في إسطنبول
export const WARDROBE_STORES: { name: string; spec: string; stars: number }[] = [
  { name: 'Tudors', spec: 'قمصان رجالية slim fit', stars: 5 },
  { name: 'Mudo', spec: 'قطع راقية، بليزرات', stars: 4 },
  { name: 'Mavi', spec: 'جينز داكن جودة عالية', stars: 4 },
  { name: 'GAP Turkey', spec: 'چينو وكنزات', stars: 3 },
  { name: 'Koton', spec: 'smart casual بسعر معقول', stars: 3 },
  { name: 'FLO', spec: 'أحذية (چلسي بوت)', stars: 3 },
  { name: 'DeFacto / LCW', spec: 'أساسيات رخيصة فقط', stars: 2 },
];

export function createSeedData(): AppData {
  return {
    version: DATA_VERSION,
    settings: {
      salaryUSD: 1000,
      exchangeRate: 45.8,
      monthlyClothingBudgetTRY: 0,
      language: 'en',
      gender: 'male',
      onboardingDone: false,
      userName: '',
      pinEnabled: false,
      theme: 'system',
    },
    fixedExpenses: FIXED,
    variableExpenses: [],
    prices: PRICES,
    groceries: GROCERIES,
    shopping: { weeks: [1, 2, 3, 4].map((week) => ({ week, checkedIds: [] })) },
    meals: { weeks: buildMeals() },
    workout: { schedule: WORKOUT_SCHEDULE, log: [], weightLog: [] },
    notes: [],
    // كل مستخدم يبني خزانته من الصفر
    wardrobe: { owned: [], wishlist: [] },
    monthlyHistory: [],
    medicines: [
      { id: 'm_vitd', name: 'فيتامين D', emoji: '☀️', time: '09:00', enabled: true },
      { id: 'm_omega', name: 'أوميغا 3', emoji: '🐟', time: '14:00', enabled: true },
    ],
    prayer: freshPrayer(),
  };
}

export function freshPrayer(): PrayerData {
  return {
    timings: null,
    timingsFetchedAt: null,
    morningAdhkarDone: Array(10).fill(false),
    eveningAdhkarDone: Array(10).fill(false),
    morningAdhkarCounts: Array(10).fill(0),
    eveningAdhkarCounts: Array(10).fill(0),
    lastResetDate: '',
    notifyMorning: true,
    notifyEvening: true,
    notifyFriday: true,
  };
}
