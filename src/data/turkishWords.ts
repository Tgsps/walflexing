// كلمة/جملة تركية لليوم — قائمة ثابتة، تُعرض واحدة كل يوم بالترتيب.
export interface TurkishWord {
  tr: string;
  ar: string;
  pron: string; // نطق تقريبي بالعربي
  category: string;
  emoji: string;
}

export const TURKISH_WORDS: TurkishWord[] = [
  // 🛒 سوبرماركت
  { tr: 'Teşekkürler', ar: 'شكراً', pron: 'تِشِكّورلِر', category: 'سوبرماركت', emoji: '🛒' },
  { tr: 'Kaç lira?', ar: 'كم ليرة؟', pron: 'كاتش ليرا', category: 'سوبرماركت', emoji: '🛒' },
  { tr: 'İndirim var mı?', ar: 'في خصم؟', pron: 'إنديريم وار مي', category: 'سوبرماركت', emoji: '🛒' },
  { tr: 'Poşet lütfen', ar: 'كيس لو سمحت', pron: 'بوشِت لُطفَن', category: 'سوبرماركت', emoji: '🛒' },
  { tr: 'Bu ne kadar?', ar: 'هذا بكم؟', pron: 'بو نه قَدَر', category: 'سوبرماركت', emoji: '🛒' },
  { tr: 'Nakit', ar: 'كاش / نقداً', pron: 'ناكِت', category: 'سوبرماركت', emoji: '🛒' },
  { tr: 'Kart', ar: 'بطاقة', pron: 'كارت', category: 'سوبرماركت', emoji: '🛒' },
  { tr: 'Taze mi?', ar: 'طازة؟', pron: 'تازه مي', category: 'سوبرماركت', emoji: '🛒' },
  { tr: 'Bir kilo', ar: 'كيلو واحد', pron: 'بير كيلو', category: 'سوبرماركت', emoji: '🛒' },
  { tr: 'Fiş alabilir miyim?', ar: 'ممكن الفاتورة؟', pron: 'فيش آلابيلير مييم', category: 'سوبرماركت', emoji: '🛒' },

  // 🍽️ مطعم
  { tr: 'Menü lütfen', ar: 'القائمة لو سمحت', pron: 'مِنو لُطفَن', category: 'مطعم', emoji: '🍽️' },
  { tr: 'Hesap lütfen', ar: 'الحساب لو سمحت', pron: 'هِساب لُطفَن', category: 'مطعم', emoji: '🍽️' },
  { tr: 'Çok güzel', ar: 'لذيذ جداً', pron: 'تشوك غوزِل', category: 'مطعم', emoji: '🍽️' },
  { tr: 'Su lütfen', ar: 'ماء لو سمحت', pron: 'سو لُطفَن', category: 'مطعم', emoji: '🍽️' },
  { tr: 'Acısız', ar: 'بدون حار', pron: 'آجيسِز', category: 'مطعم', emoji: '🍽️' },
  { tr: 'Afiyet olsun', ar: 'بالهنا والعافية', pron: 'آفيِت أولسون', category: 'مطعم', emoji: '🍽️' },
  { tr: 'Bir çay', ar: 'شاي واحد', pron: 'بير تشاي', category: 'مطعم', emoji: '🍽️' },
  { tr: 'Doydum', ar: 'شبعت', pron: 'دويدوم', category: 'مطعم', emoji: '🍽️' },
  { tr: 'Paket olsun', ar: 'سفري / تيك أواي', pron: 'باكِت أولسون', category: 'مطعم', emoji: '🍽️' },
  { tr: 'Helal mi?', ar: 'حلال؟', pron: 'حلال مي', category: 'مطعم', emoji: '🍽️' },

  // 🚇 مواصلات
  { tr: 'İstanbul Kart', ar: 'بطاقة إسطنبول', pron: 'إسطنبول كارت', category: 'مواصلات', emoji: '🚇' },
  { tr: 'Durak', ar: 'محطة', pron: 'دوراك', category: 'مواصلات', emoji: '🚇' },
  { tr: 'Aktarma', ar: 'تحويل (تبديل خط)', pron: 'آكتارما', category: 'مواصلات', emoji: '🚇' },
  { tr: 'Nerede?', ar: 'وين؟', pron: 'نِرِده', category: 'مواصلات', emoji: '🚇' },
  { tr: 'Sağa dön', ar: 'لِف يمين', pron: 'ساعا دون', category: 'مواصلات', emoji: '🚇' },
  { tr: 'Sola dön', ar: 'لِف يسار', pron: 'سولا دون', category: 'مواصلات', emoji: '🚇' },
  { tr: 'Düz git', ar: 'دغري / مستقيم', pron: 'دوز غيت', category: 'مواصلات', emoji: '🚇' },
  { tr: 'Ne kadar uzak?', ar: 'كم بعيد؟', pron: 'نه قَدَر أوزاك', category: 'مواصلات', emoji: '🚇' },
  { tr: 'Taksi', ar: 'تاكسي', pron: 'تاكسي', category: 'مواصلات', emoji: '🚇' },
  { tr: 'Burada inecek var', ar: 'في نزول هون', pron: 'بورَدا إنِجِك وار', category: 'مواصلات', emoji: '🚇' },

  // 🏋️ جيم
  { tr: 'Spor salonu', ar: 'صالة رياضية', pron: 'سبور سالونو', category: 'جيم', emoji: '🏋️' },
  { tr: 'Antrenman', ar: 'تمرين', pron: 'آنترِنمان', category: 'جيم', emoji: '🏋️' },
  { tr: 'Yoruldum', ar: 'تعبت', pron: 'يورولدوم', category: 'جيم', emoji: '🏋️' },
  { tr: 'Ağırlık', ar: 'وزن (حديد)', pron: 'آعِرلِك', category: 'جيم', emoji: '🏋️' },
  { tr: 'Üyelik', ar: 'اشتراك', pron: 'أويِلِك', category: 'جيم', emoji: '🏋️' },
  { tr: 'Su şişesi', ar: 'قنينة ماء', pron: 'سو شيشِسي', category: 'جيم', emoji: '🏋️' },
  { tr: 'Bir set daha', ar: 'مجموعة كمان', pron: 'بير سِت داها', category: 'جيم', emoji: '🏋️' },
  { tr: 'Dinlenme', ar: 'راحة', pron: 'دينلِنمه', category: 'جيم', emoji: '🏋️' },
  { tr: 'Koşu bandı', ar: 'جهاز المشي', pron: 'كوشو باندي', category: 'جيم', emoji: '🏋️' },
  { tr: 'Kaslı', ar: 'مفتول العضلات', pron: 'كاسلي', category: 'جيم', emoji: '🏋️' },

  // 🏠 يومي
  { tr: 'Günaydın', ar: 'صباح الخير', pron: 'غوناٍيدِن', category: 'يومي', emoji: '🏠' },
  { tr: 'İyi geceler', ar: 'تصبح على خير', pron: 'إيي غِجِلِر', category: 'يومي', emoji: '🏠' },
  { tr: 'Nasılsın?', ar: 'كيف حالك؟', pron: 'ناسِلسِن', category: 'يومي', emoji: '🏠' },
  { tr: 'İyiyim', ar: 'أنا بخير', pron: 'إييم', category: 'يومي', emoji: '🏠' },
  { tr: 'Lütfen', ar: 'لو سمحت', pron: 'لُطفَن', category: 'يومي', emoji: '🏠' },
  { tr: 'Affedersiniz', ar: 'المعذرة', pron: 'آفّدِرسينيز', category: 'يومي', emoji: '🏠' },
  { tr: 'Evet / Hayır', ar: 'نعم / لا', pron: 'إِوِت / هايِر', category: 'يومي', emoji: '🏠' },
  { tr: 'Anlamadım', ar: 'ما فهمت', pron: 'آنلامادِم', category: 'يومي', emoji: '🏠' },
  { tr: 'Görüşürüz', ar: 'نشوفك / إلى اللقاء', pron: 'غوروشورُز', category: 'يومي', emoji: '🏠' },
  { tr: 'Tamam', ar: 'تمام / أوكي', pron: 'تامام', category: 'يومي', emoji: '🏠' },

  // 🆘 طوارئ
  { tr: 'Yardım!', ar: 'النجدة!', pron: 'ياردِم', category: 'طوارئ', emoji: '🆘' },
  { tr: 'Doktor nerede?', ar: 'وين الدكتور؟', pron: 'دوكتور نِرِده', category: 'طوارئ', emoji: '🆘' },
  { tr: 'Kayboldum', ar: 'تهت', pron: 'كايبولدوم', category: 'طوارئ', emoji: '🆘' },
  { tr: 'Hastane', ar: 'مستشفى', pron: 'هاستانه', category: 'طوارئ', emoji: '🆘' },
  { tr: 'Polis', ar: 'شرطة', pron: 'بوليس', category: 'طوارئ', emoji: '🆘' },
  { tr: 'Eczane', ar: 'صيدلية', pron: 'إجزانه', category: 'طوارئ', emoji: '🆘' },
  { tr: 'Acil', ar: 'طارئ / إسعاف', pron: 'آجِل', category: 'طوارئ', emoji: '🆘' },
  { tr: 'Telefonum çalındı', ar: 'انسرق تلفوني', pron: 'تِلِفونوم تشالِندي', category: 'طوارئ', emoji: '🆘' },
  { tr: 'Pasaportum kayıp', ar: 'ضاع جوازي', pron: 'باسابورتوم كايِب', category: 'طوارئ', emoji: '🆘' },
  { tr: 'Ambulans çağırın', ar: 'نادوا إسعاف', pron: 'آمبولانس تشاعِرِن', category: 'طوارئ', emoji: '🆘' },
];

const EPOCH = Date.UTC(2026, 0, 1); // 2026-01-01

export function wordOfToday(d = new Date()): { word: TurkishWord; index: number; total: number } {
  const dayNum = Math.floor((d.getTime() - EPOCH) / 86400000);
  const total = TURKISH_WORDS.length;
  const index = ((dayNum % total) + total) % total;
  return { word: TURKISH_WORDS[index], index: index + 1, total };
}
