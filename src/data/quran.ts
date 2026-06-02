// آيات قرآنية للطمأنينة والقوة والشكر — تتغيّر يومياً (مع بذرة لكل جهاز).
// ⚠️ راجِع النصّ القرآني والترجمات قبل النشر — الدقّة أمانة. (rقم السورة:الآية للتحقّق)
export interface Verse {
  ref: string; // Surah:Ayah
  ar: string;
  latin: string; // transliteration
  en: string;
  tr: string;
}

export const VERSES: Verse[] = [
  { ref: '2:286', ar: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', latin: 'Lā yukallifu-llāhu nafsan illā wusʿahā', en: 'Allah does not burden a soul beyond that it can bear.', tr: 'Allah hiç kimseye gücünün üstünde bir şey yüklemez.' },
  { ref: '94:5', ar: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', latin: 'Fa-inna maʿa-l-ʿusri yusrā', en: 'For indeed, with hardship comes ease.', tr: 'Şüphesiz her zorlukla beraber bir kolaylık vardır.' },
  { ref: '13:28', ar: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', latin: 'Alā bi-dhikri-llāhi taṭmaʾinnu-l-qulūb', en: 'Verily, in the remembrance of Allah do hearts find rest.', tr: 'Bilesiniz ki kalpler ancak Allah’ı anmakla huzur bulur.' },
  { ref: '2:153', ar: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', latin: 'Inna-llāha maʿa-ṣ-ṣābirīn', en: 'Indeed, Allah is with the patient.', tr: 'Şüphesiz Allah sabredenlerle beraberdir.' },
  { ref: '65:3', ar: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', latin: 'Wa man yatawakkal ʿalā-llāhi fa-huwa ḥasbuh', en: 'And whoever relies upon Allah — then He is sufficient for him.', tr: 'Kim Allah’a tevekkül ederse, O ona yeter.' },
  { ref: '3:139', ar: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ', latin: 'Wa lā tahinū wa lā taḥzanū wa antumu-l-aʿlawna in kuntum muʾminīn', en: 'Do not weaken and do not grieve, for you will be superior if you are believers.', tr: 'Gevşemeyin, üzülmeyin; eğer inanıyorsanız üstün olan sizsiniz.' },
  { ref: '14:7', ar: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', latin: 'La-in shakartum la-azīdannakum', en: 'If you are grateful, I will surely increase you.', tr: 'Eğer şükrederseniz, elbette size (nimetimi) artırırım.' },
  { ref: '40:60', ar: 'ادْعُونِي أَسْتَجِبْ لَكُمْ', latin: 'Udʿūnī astajib lakum', en: 'Call upon Me; I will respond to you.', tr: 'Bana dua edin, size karşılık vereyim.' },
  { ref: '2:152', ar: 'فَاذْكُرُونِي أَذْكُرْكُمْ', latin: 'Fa-dhkurūnī adhkurkum', en: 'So remember Me; I will remember you.', tr: 'Öyleyse beni anın ki ben de sizi anayım.' },
  { ref: '39:53', ar: 'لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ', latin: 'Lā taqnaṭū min raḥmati-llāh', en: 'Do not despair of the mercy of Allah.', tr: 'Allah’ın rahmetinden ümidinizi kesmeyin.' },
  { ref: '3:159', ar: 'فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ', latin: 'Fa-idhā ʿazamta fa-tawakkal ʿalā-llāh', en: 'And when you have decided, then rely upon Allah.', tr: 'Bir işe karar verince de Allah’a güven.' },
  { ref: '2:186', ar: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ', latin: 'Wa idhā saʾalaka ʿibādī ʿannī fa-innī qarīb', en: 'And when My servants ask you concerning Me — indeed I am near.', tr: 'Kullarım sana beni sorduğunda, (bilsinler ki) ben yakınım.' },
  { ref: '3:173', ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', latin: 'Ḥasbunā-llāhu wa niʿma-l-wakīl', en: 'Sufficient for us is Allah, and He is the best Disposer of affairs.', tr: 'Allah bize yeter, O ne güzel vekildir.' },
  { ref: '93:5', ar: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', latin: 'Wa la-sawfa yuʿṭīka rabbuka fa-tarḍā', en: 'And your Lord is going to give you, and you will be satisfied.', tr: 'Rabbin sana verecek ve sen razı olacaksın.' },
  { ref: '94:6', ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', latin: 'Inna maʿa-l-ʿusri yusrā', en: 'Indeed, with hardship comes ease.', tr: 'Gerçekten, zorlukla beraber bir kolaylık vardır.' },
  { ref: '8:46', ar: 'وَاصْبِرُوا ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', latin: 'Waṣbirū inna-llāha maʿa-ṣ-ṣābirīn', en: 'And be patient. Indeed, Allah is with the patient.', tr: 'Sabredin; şüphesiz Allah sabredenlerle beraberdir.' },
  { ref: '2:156', ar: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', latin: 'Innā li-llāhi wa innā ilayhi rājiʿūn', en: 'Indeed we belong to Allah, and indeed to Him we will return.', tr: 'Biz şüphesiz Allah’a aitiz ve yine O’na döneceğiz.' },
  { ref: '9:51', ar: 'قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا', latin: 'Qul lan yuṣībanā illā mā kataba-llāhu lanā', en: 'Say: Never will we be struck except by what Allah has decreed for us.', tr: 'De ki: Allah’ın bizim için yazdığından başkası bize asla erişmez.' },
  { ref: '29:69', ar: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا', latin: 'Wa-lladhīna jāhadū fīnā la-nahdiyannahum subulanā', en: 'And those who strive for Us — We will surely guide them to Our ways.', tr: 'Bizim uğrumuzda gayret edenleri, elbette yollarımıza eriştiririz.' },
  { ref: '13:11', ar: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ', latin: 'Inna-llāha lā yughayyiru mā bi-qawmin ḥattā yughayyirū mā bi-anfusihim', en: 'Indeed, Allah will not change a people until they change what is in themselves.', tr: 'Bir toplum kendini değiştirmedikçe Allah onların durumunu değiştirmez.' },
  { ref: '64:11', ar: 'وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ', latin: 'Wa man yuʾmin bi-llāhi yahdi qalbah', en: 'And whoever believes in Allah — He will guide his heart.', tr: 'Kim Allah’a inanırsa, Allah onun kalbini doğruya iletir.' },
  { ref: '49:13', ar: 'إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ', latin: 'Inna akramakum ʿinda-llāhi atqākum', en: 'Indeed, the most noble of you in the sight of Allah is the most righteous.', tr: 'Allah katında en değerliniz, O’na karşı en çok sorumluluk bilinci taşıyanınızdır.' },
  { ref: '16:97', ar: 'مَنْ عَمِلَ صَالِحًا فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً', latin: 'Man ʿamila ṣāliḥan fa-la-nuḥyiyannahu ḥayātan ṭayyibah', en: 'Whoever does righteousness — We will surely give them a good life.', tr: 'Kim iyi bir iş yaparsa, ona güzel bir hayat yaşatırız.' },
  { ref: '39:10', ar: 'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ', latin: 'Innamā yuwaffā-ṣ-ṣābirūna ajrahum bi-ghayri ḥisāb', en: 'The patient will be given their reward without measure.', tr: 'Sabredenlere mükâfatları hesapsız verilir.' },
  { ref: '2:201', ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', latin: 'Rabbanā ātinā fi-d-dunyā ḥasanatan wa fi-l-ākhirati ḥasanah', en: 'Our Lord, give us good in this world and good in the Hereafter.', tr: 'Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver.' },
  { ref: '20:114', ar: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', latin: 'Wa qul rabbi zidnī ʿilmā', en: 'And say: My Lord, increase me in knowledge.', tr: 'De ki: Rabbim, ilmimi artır.' },
  { ref: '33:3', ar: 'وَتَوَكَّلْ عَلَى اللَّهِ ۚ وَكَفَىٰ بِاللَّهِ وَكِيلًا', latin: 'Wa tawakkal ʿalā-llāhi wa kafā bi-llāhi wakīlā', en: 'And rely upon Allah; and sufficient is Allah as Disposer of affairs.', tr: 'Allah’a güven; vekil olarak Allah yeter.' },
  { ref: '65:2', ar: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', latin: 'Wa man yattaqi-llāha yajʿal lahu makhrajā', en: 'And whoever fears Allah — He will make for him a way out.', tr: 'Kim Allah’a karşı sorumluluk bilinciyle yaşarsa, Allah ona bir çıkış yolu açar.' },
  { ref: '10:62', ar: 'أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ', latin: 'Alā inna awliyāʾa-llāhi lā khawfun ʿalayhim wa lā hum yaḥzanūn', en: 'Unquestionably, the allies of Allah — no fear upon them, nor shall they grieve.', tr: 'Bilesiniz ki Allah’ın dostlarına korku yoktur, onlar üzülmeyecekler de.' },
  { ref: '3:200', ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا', latin: 'Yā ayyuhā-lladhīna āmanu-ṣbirū wa ṣābirū', en: 'O you who believe, be patient and persevere.', tr: 'Ey iman edenler! Sabredin ve sabırda yarışın.' },
  { ref: '2:45', ar: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', latin: 'Wa-staʿīnū bi-ṣ-ṣabri wa-ṣ-ṣalāh', en: 'And seek help through patience and prayer.', tr: 'Sabır ve namazla yardım dileyin.' },
  { ref: '94:8', ar: 'وَإِلَىٰ رَبِّكَ فَارْغَب', latin: 'Wa ilā rabbika fa-rghab', en: 'And to your Lord direct your longing.', tr: 'Ve yalnız Rabbine yönel.' },
  { ref: '6:162', ar: 'قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ', latin: 'Qul inna ṣalātī wa nusukī wa maḥyāya wa mamātī li-llāhi rabbi-l-ʿālamīn', en: 'Say: My prayer, my rites, my living and my dying are for Allah, Lord of the worlds.', tr: 'De ki: Namazım, ibadetim, hayatım ve ölümüm âlemlerin Rabbi Allah içindir.' },
  { ref: '99:7', ar: 'فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ', latin: 'Fa-man yaʿmal mithqāla dharratin khayran yarah', en: 'So whoever does an atom’s weight of good will see it.', tr: 'Kim zerre kadar iyilik yaparsa onu görür.' },
  { ref: '67:2', ar: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا', latin: 'Alladhī khalaqa-l-mawta wa-l-ḥayāta li-yabluwakum ayyukum aḥsanu ʿamalā', en: 'He who created death and life to test which of you is best in deed.', tr: 'O, hanginizin daha güzel iş yapacağını denemek için ölümü ve hayatı yarattı.' },
  { ref: '31:17', ar: 'وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ ۖ إِنَّ ذَٰلِكَ مِنْ عَزْمِ الْأُمُورِ', latin: 'Waṣbir ʿalā mā aṣābaka inna dhālika min ʿazmi-l-umūr', en: 'And be patient over what befalls you. Indeed, that is of the matters requiring resolve.', tr: 'Başına gelene sabret; bu, kararlılık gerektiren işlerdendir.' },
  { ref: '2:255', ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', latin: 'Allāhu lā ilāha illā huwa-l-ḥayyu-l-qayyūm', en: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer.', tr: 'Allah, kendisinden başka hiçbir ilah olmayandır; diridir, her şeyi ayakta tutandır.' },
  { ref: '3:26', ar: 'قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ', latin: 'Quli-llāhumma mālika-l-mulki tuʾti-l-mulka man tashāʾ', en: 'Say: O Allah, Owner of Sovereignty, You give sovereignty to whom You will.', tr: 'De ki: Ey mülkün sahibi Allah’ım! Mülkü dilediğine verirsin.' },
  { ref: '40:44', ar: 'وَأُفَوِّضُ أَمْرِي إِلَى اللَّهِ ۚ إِنَّ اللَّهَ بَصِيرٌ بِالْعِبَادِ', latin: 'Wa ufawwiḍu amrī ilā-llāh, inna-llāha baṣīrun bi-l-ʿibād', en: 'And I entrust my affair to Allah. Indeed, Allah is Seeing of His servants.', tr: 'İşimi Allah’a bırakıyorum. Şüphesiz Allah kullarını görendir.' },
  { ref: '12:87', ar: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ', latin: 'Wa lā tayʾasū min rawḥi-llāh', en: 'And do not despair of relief from Allah.', tr: 'Allah’ın rahmetinden ümit kesmeyin.' },
];

function dayOfYear(d = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** معرّف جهاز ثابت محلياً (لاختيار آية مختلفة لكل مستخدم نفس اليوم) */
export function getDeviceId(): string {
  let id = localStorage.getItem('device_id_v1');
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('device_id_v1', id);
  }
  return id;
}

export function verseOfToday(d = new Date()): Verse {
  const idx = (hashStr(getDeviceId()) + dayOfYear(d)) % VERSES.length;
  return VERSES[idx];
}
