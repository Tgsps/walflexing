// أذكار الصباح والمساء — من حصن المسلم. ⚠️ راجِع النصوص قبل النشر.
export interface Dhikr {
  ar: string;
  en: string;
  tr: string;
  count: number;
}

export const MORNING_ADHKAR: Dhikr[] = [
  {
    ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ (آية الكرسي)',
    en: 'Ayat al-Kursi (2:255) — a protection for the day.',
    tr: 'Âyetel Kürsî (2:255) — gün boyu koruma.',
    count: 1,
  },
  {
    ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    en: 'We have reached the morning and at this very time the whole kingdom belongs to Allah.',
    tr: 'Sabaha erdik, mülk de Allah’ındır. Hamd Allah’a mahsustur.',
    count: 1,
  },
  {
    ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    en: 'O Allah, by You we enter the morning and the evening, by You we live and die, and to You is the resurrection.',
    tr: 'Allah’ım! Seninle sabahladık, seninle akşamladık; seninle yaşar, seninle ölürüz; dönüş de sanadır.',
    count: 1,
  },
  {
    ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ (سيد الاستغفار)',
    en: 'Sayyid al-Istighfar — the best way of seeking forgiveness.',
    tr: 'Seyyidü’l-İstiğfar — bağışlanma dilemenin en üstünü.',
    count: 1,
  },
  {
    ar: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    en: 'Allah is sufficient for me; there is none worthy of worship but Him. Upon Him I rely.',
    tr: 'Allah bana yeter; O’ndan başka ilah yoktur. O’na güvendim.',
    count: 7,
  },
  {
    ar: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    en: 'In the name of Allah with whose name nothing on earth or in heaven can cause harm.',
    tr: 'Adıyla, yerde ve gökte hiçbir şeyin zarar veremeyeceği Allah’ın adıyla.',
    count: 3,
  },
  {
    ar: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
    en: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad ﷺ as my Prophet.',
    tr: 'Rab olarak Allah’tan, din olarak İslam’dan, peygamber olarak Muhammed ﷺ’den razı oldum.',
    count: 3,
  },
  {
    ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    en: 'Glory and praise be to Allah.',
    tr: 'Allah’ı hamd ile tesbih ederim.',
    count: 100,
  },
  {
    ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    en: 'There is none worthy of worship but Allah alone, with no partner; His is the dominion and praise, and He is able to do all things.',
    tr: 'Allah’tan başka ilah yoktur, tektir, ortağı yoktur. Mülk ve hamd O’nundur; O her şeye kadirdir.',
    count: 10,
  },
  {
    ar: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي',
    en: 'O Allah, grant my body health; O Allah, grant my hearing health; O Allah, grant my sight health.',
    tr: 'Allah’ım, bedenime, kulağıma ve gözüme afiyet ver.',
    count: 3,
  },
];

export const EVENING_ADHKAR: Dhikr[] = [
  {
    ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ (آية الكرسي)',
    en: 'Ayat al-Kursi (2:255) — a protection for the night.',
    tr: 'Âyetel Kürsî (2:255) — gece boyu koruma.',
    count: 1,
  },
  {
    ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    en: 'We have reached the evening and at this very time the whole kingdom belongs to Allah.',
    tr: 'Akşama erdik, mülk de Allah’ındır. Hamd Allah’a mahsustur.',
    count: 1,
  },
  {
    ar: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    en: 'O Allah, by You we enter the evening and the morning, by You we live and die, and to You is the final return.',
    tr: 'Allah’ım! Seninle akşamladık, seninle sabahladık; seninle yaşar, seninle ölürüz; dönüş de sanadır.',
    count: 1,
  },
  {
    ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ (سيد الاستغفار)',
    en: 'Sayyid al-Istighfar — the best way of seeking forgiveness.',
    tr: 'Seyyidü’l-İstiğfar — bağışlanma dilemenin en üstünü.',
    count: 1,
  },
  {
    ar: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    en: 'I seek refuge in the perfect words of Allah from the evil of what He created.',
    tr: 'Yarattıklarının şerrinden Allah’ın eksiksiz kelimelerine sığınırım.',
    count: 3,
  },
  {
    ar: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    en: 'Allah is sufficient for me; there is none worthy of worship but Him. Upon Him I rely.',
    tr: 'Allah bana yeter; O’ndan başka ilah yoktur. O’na güvendim.',
    count: 7,
  },
  {
    ar: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    en: 'In the name of Allah with whose name nothing on earth or in heaven can cause harm.',
    tr: 'Adıyla, yerde ve gökte hiçbir şeyin zarar veremeyeceği Allah’ın adıyla.',
    count: 3,
  },
  {
    ar: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
    en: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad ﷺ as my Prophet.',
    tr: 'Rab olarak Allah’tan, din olarak İslam’dan, peygamber olarak Muhammed ﷺ’den razı oldum.',
    count: 3,
  },
  {
    ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    en: 'Glory and praise be to Allah.',
    tr: 'Allah’ı hamd ile tesbih ederim.',
    count: 100,
  },
  {
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
    en: 'O Allah, I ask You for pardon and well-being in this world and the next.',
    tr: 'Allah’ım! Dünyada ve ahirette senden af ve afiyet dilerim.',
    count: 1,
  },
];
