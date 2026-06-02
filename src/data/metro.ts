// خط المترو M2 (إسطنبول) — بيانات ثابتة، بدون أي API.
export interface MetroStation {
  id: number;
  tr: string;
  ar: string;
  lat: number;
  lng: number;
}

export const M2 = {
  line: 'M2',
  color: '#6DC36D',
  firstTrain: '06:00',
  lastTrain: '00:00',
  stations: [
    { id: 1, tr: 'Yenikapı', ar: 'يِنيكابي', lat: 41.0042, lng: 28.9505 },
    { id: 2, tr: 'Vezneciler-İstanbul Ü.', ar: 'وزنجيلر - جامعة إسطنبول', lat: 41.0164, lng: 28.9595 },
    { id: 3, tr: 'Haliç', ar: 'هاليتش (القرن الذهبي)', lat: 41.0317, lng: 28.9497 },
    { id: 4, tr: 'Şişhane', ar: 'شيشهانه (غلطة)', lat: 41.0363, lng: 28.9743 },
    { id: 5, tr: 'Taksim', ar: 'تقسيم', lat: 41.0369, lng: 28.985 },
    { id: 6, tr: 'Osmanbey', ar: 'عثمان بيه', lat: 41.0477, lng: 28.9869 },
    { id: 7, tr: 'Şişli-Mecidiyeköy', ar: 'شيشلي - مجيديةكوي', lat: 41.0601, lng: 28.9869 },
    { id: 8, tr: 'Gayrettepe', ar: 'غايرةتّبه', lat: 41.0699, lng: 28.9978 },
    { id: 9, tr: 'Levent', ar: 'لِفِنت', lat: 41.0793, lng: 29.0108 },
    { id: 10, tr: '4. Levent', ar: 'لِفِنت الرابع', lat: 41.0867, lng: 29.0108 },
    { id: 11, tr: 'Sanayi Mahallesi', ar: 'صناعي (تحويل Seyrantepe)', lat: 41.1008, lng: 29.0175 },
    { id: 12, tr: 'İTÜ-Ayazağa', ar: 'ITÜ - آياضاغا', lat: 41.1097, lng: 29.0201 },
    { id: 13, tr: 'Atatürk Oto Sanayi', ar: 'أتاتورك أوتو صناعي', lat: 41.115, lng: 29.0216 },
    { id: 14, tr: 'Darüşşafaka', ar: 'دارالشفقة', lat: 41.1225, lng: 29.0237 },
    { id: 15, tr: 'Hacıosman', ar: 'حاجي عثمان', lat: 41.1303, lng: 29.0249 },
  ] as MetroStation[],
};

/** المسافة بين نقطتين (Haversine) بالكيلومتر */
function haversine(la1: number, lo1: number, la2: number, lo2: number): number {
  const R = 6371;
  const dLa = ((la2 - la1) * Math.PI) / 180;
  const dLo = ((lo2 - lo1) * Math.PI) / 180;
  const a =
    Math.sin(dLa / 2) ** 2 +
    Math.cos((la1 * Math.PI) / 180) * Math.cos((la2 * Math.PI) / 180) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** أقرب محطة M2 لإحداثيات المستخدم */
export function nearestStation(lat: number, lng: number): MetroStation {
  return M2.stations.reduce((best, s) =>
    haversine(lat, lng, s.lat, s.lng) < haversine(lat, lng, best.lat, best.lng) ? s : best,
  );
}

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
