// خط المترو M2 (إسطنبول) — بيانات ثابتة، بدون أي API.
export interface MetroStation {
  id: number;
  tr: string;
  ar: string;
}

export const M2 = {
  line: 'M2',
  color: '#6DC36D',
  firstTrain: '06:00',
  lastTrain: '00:00',
  stations: [
    { id: 1, tr: 'Yenikapı', ar: 'يِنيكابي' },
    { id: 2, tr: 'Vezneciler-İstanbul Ü.', ar: 'وزنجيلر - جامعة إسطنبول' },
    { id: 3, tr: 'Haliç', ar: 'هاليتش (القرن الذهبي)' },
    { id: 4, tr: 'Şişhane', ar: 'شيشهانه (غلطة)' },
    { id: 5, tr: 'Taksim', ar: 'تقسيم' },
    { id: 6, tr: 'Osmanbey', ar: 'عثمان بيه' },
    { id: 7, tr: 'Şişli-Mecidiyeköy', ar: 'شيشلي - مجيديةكوي' },
    { id: 8, tr: 'Gayrettepe', ar: 'غايرةتّبه' },
    { id: 9, tr: 'Levent', ar: 'لِفِنت' },
    { id: 10, tr: '4. Levent', ar: 'لِفِنت الرابع' },
    { id: 11, tr: 'Sanayi Mahallesi', ar: 'صناعي (تحويل Seyrantepe)' },
    { id: 12, tr: 'İTÜ-Ayazağa', ar: 'ITÜ - آياضاغا' },
    { id: 13, tr: 'Atatürk Oto Sanayi', ar: 'أتاتورك أوتو صناعي' },
    { id: 14, tr: 'Darüşşafaka', ar: 'دارالشفقة' },
    { id: 15, tr: 'Hacıosman', ar: 'حاجي عثمان' },
  ] as MetroStation[],
};

/** تردد القطار حسب الوقت/اليوم الحالي — يُرجع مفتاح ترجمة (metro.<token>) */
export function metroFrequency(d = new Date()): 'peak' | 'offpeak' | 'weekend' | 'night' {
  const day = d.getDay(); // 0 أحد .. 6 سبت
  const h = d.getHours();
  const weekend = day === 0 || day === 6;
  if ((day === 5 || day === 6) && h >= 0 && h < 6) return 'night';
  if (weekend) return 'weekend';
  const peak = (h >= 7 && h <= 10) || (h >= 17 && h <= 20);
  return peak ? 'peak' : 'offpeak';
}

/** هل المترو شغّال الآن؟ (06:00 → 00:00) */
export function metroRunning(d = new Date()): boolean {
  const h = d.getHours();
  return h >= 6 && h <= 23;
}
