// Helpers that translate strings stored in app data (Arabic canonical values)
// via stable key-maps — so no data/logic changes are needed and saved data works.
import type { Recipe } from '../types';

type T = (key: string, opts?: Record<string, unknown>) => string;

// ---- meal plan names (Arabic seed string -> mealNames.<key>) ----------------
const MEAL_KEY: Record<string, string> = {
  'دجاج بالثوم والزبدة + رز': 'd_chicken_garlic_butter',
  'سلمون بالفرن بالليمون': 'd_salmon_oven_lemon',
  'دجاج بالفرن مع البطاطا': 'd_chicken_oven_potato',
  'كفتة لحمة + رز': 'd_kofta_rice',
  'سلمون مقلي + خضار سوتيه': 'd_salmon_pan_veg',
  'دجاج مقلي سريع بالفلفل': 'd_chicken_quick_pepper',
  'يوم برا / سمك برا': 'd_out_day',
  'دجاج بالليمون والبروكلي': 'd_chicken_lemon_broccoli',
  'سلمون بالعسل والصويا + رز': 'd_salmon_honey_soy',
  'دجاج بالمشروم': 'd_chicken_mushroom',
  'لحمة مفرومة مع البطاطا': 'd_mince_potato',
  'سلمون بالفرن + خضار محمّر': 'd_salmon_oven_veg',
  'دجاج مشوي متبّل + سلطة': 'd_chicken_grilled_salad',
  'برغر لحمة + سلطة': 'd_burger_salad',
  'بيض مقلي + جبنة + بندورة': 'b_fried_eggs_cheese_tomato',
  'شوفان بالحليب + موز': 'b_oats_milk_banana',
  'أومليت بالخضار': 'b_omelette_veg',
  'لبن + شوفان + تفاح': 'b_yogurt_oats_apple',
  'بيض مسلوق + خبز + جبنة': 'b_boiled_eggs_bread_cheese',
  منمن: 'b_menemen',
  'ساندويش دجاج (من البقايا)': 'b_chicken_sandwich_leftover',
  'أومليت بالجبنة': 'b_omelette_cheese',
  'شوفان + موز + عسل': 'b_oats_banana_honey',
  'بيض مخفوق + جبنة': 'b_scrambled_eggs_cheese',
  'لبن + تفاح + شوفان': 'b_yogurt_apple_oats',
  'بيض مسلوق + خبز + خيار': 'b_boiled_eggs_bread_cucumber',
  'بيض + بقايا دجاج': 'b_eggs_chicken_leftover',
  'ساندويش دجاج': 'b_chicken_sandwich',
  'لبن + تفاح': 'b_yogurt_apple',
  'بيض مسلوق + خيار': 'b_boiled_eggs_cucumber',
  'بقايا عشاء الأمس · أو سلطة + بروتين خفيف': 'lunch_default',
};
export function tMeal(name: string, t: T): string {
  const k = MEAL_KEY[name];
  return k ? t(`mealNames.${k}`) : name;
}

// ---- workout focus (Arabic -> workoutFocus.<key>) ---------------------------
const FOCUS_KEY: Record<string, string> = {
  'ظهر + باي + ساعد': 'back_biceps_forearms',
  'صدر + تراي': 'chest_triceps',
  'أكتاف + بطن + ترابيس': 'shoulders_abs_traps',
  أرجل: 'legs',
  راحة: 'rest',
  'حدّده بنفسك': 'custom',
};
export function tFocus(focus: string, t: T): string {
  const k = FOCUS_KEY[focus];
  return k ? t(`workoutFocus.${k}`) : focus;
}

// ---- colors (Arabic -> colors.<key>) ----------------------------------------
const COLOR_KEY: Record<string, string> = {
  أسود: 'black',
  أبيض: 'white',
  زيتي: 'olive',
  'كحلي داكن': 'darkNavy',
  فضي: 'silver',
  'أسود/فضي': 'blackSilver',
  '—': 'dash',
};
export function tColor(color: string, t: T): string {
  const k = COLOR_KEY[color];
  return k ? t(`colors.${k}`) : color;
}

// ---- day names --------------------------------------------------------------
const DAY_TOKEN: Record<string, string> = {
  السبت: 'sat',
  الأحد: 'sun',
  الإثنين: 'mon',
  الثلاثاء: 'tue',
  الأربعاء: 'wed',
  الخميس: 'thu',
  الجمعة: 'fri',
};
const JS_TOKENS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export function tDayName(arDay: string, t: T): string {
  const tok = DAY_TOKEN[arDay];
  return tok ? t(`days.${tok}`) : arDay;
}
export function tTodayName(t: T, d = new Date()): string {
  return t(`days.${JS_TOKENS[d.getDay()]}`);
}

// ---- wardrobe category (Arabic -> wardrobeCat.<key>) ------------------------
const WARDROBE_CAT_TOKEN: Record<string, string> = {
  قمصان: 'shirts',
  بنطلونات: 'pants',
  طبقات: 'layers',
  أحذية: 'shoes',
  إكسسوار: 'accessories',
};
export function tWardrobeCat(arCat: string, t: T): string {
  const k = WARDROBE_CAT_TOKEN[arCat];
  return k ? t(`wardrobeCat.${k}`) : arCat;
}

// ---- turkish word category (Arabic -> wordCat.<key>) ------------------------
const WORDCAT_TOKEN: Record<string, string> = {
  سوبرماركت: 'supermarket',
  مطعم: 'restaurant',
  مواصلات: 'transport',
  جيم: 'gym',
  يومي: 'daily',
  طوارئ: 'emergency',
};
export function tWordCat(arCat: string, t: T): string {
  const k = WORDCAT_TOKEN[arCat];
  return k ? t(`wordCat.${k}`) : arCat;
}

// ---- weather condition (code -> weather.cond.<token>) -----------------------
export function weatherCondToken(code: number): string {
  if (code === 0) return 'clear';
  if (code <= 3) return 'partlyCloudy';
  if (code <= 48) return 'fog';
  if (code <= 67) return 'rain';
  if (code <= 77) return 'snow';
  if (code <= 82) return 'showers';
  if (code <= 86) return 'snow';
  return 'storms';
}
export function tWeatherCond(code: number, t: T): string {
  return t(`weather.cond.${weatherCondToken(code)}`);
}

// ---- by-id helpers (fall back to the stored value for custom items) ---------
export const tGroceryName = (id: string, t: T, fb: string) =>
  t(`groceryNames.${id}`, { defaultValue: fb });
export const tGroceryQty = (id: string, t: T, fb: string) =>
  t(`groceryQty.${id}`, { defaultValue: fb });
export const tPriceName = (id: string, t: T, fb: string) =>
  t(`priceNames.${id}`, { defaultValue: fb });
export const tPriceUnit = (id: string, t: T, fb: string) =>
  t(`priceUnits.${id}`, { defaultValue: fb });
export const tFixedName = (id: string, t: T, fb: string) =>
  t(`fixedNames.${id}`, { defaultValue: fb });
export const tOwnedName = (id: string, t: T, fb: string) =>
  t(`ownedNames.${id}`, { defaultValue: fb });
export const tWishName = (id: string, t: T, fb: string) =>
  t(`wishlistNames.${id}`, { defaultValue: fb });
export const tStoreSpec = (name: string, t: T, fb: string) =>
  t(`storeSpecs.${name}`, { defaultValue: fb });
export const tMedName = (id: string, t: T, fb: string) => t(`medNames.${id}`, { defaultValue: fb });

// ---- recipe (pull translated fields by id) ----------------------------------
export function getRecipe(id: string, emoji: string, t: T): Recipe {
  return {
    id,
    emoji,
    title: t(`recipes.${id}.title`),
    subtitle: t(`recipes.${id}.subtitle`),
    time: t(`recipes.${id}.time`),
    ingredients: t(`recipes.${id}.ingredients`, { returnObjects: true }) as unknown as string[],
    steps: t(`recipes.${id}.steps`, { returnObjects: true }) as unknown as string[],
    tip: t(`recipes.${id}.tip`),
  };
}
