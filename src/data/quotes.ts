// عبارات تحفيزية للتمرين — ثابتة بـ 3 لغات. تدور يومي/أسبوعي/شهري.
export interface Quote {
  en: string;
  ar: string;
  tr: string;
}

export const DAILY_QUOTES: Quote[] = [
  { en: 'Pain is temporary, pride is forever.', ar: 'الألم مؤقت، الفخر أبدي.', tr: 'Acı geçici, gurur kalıcı.' },
  { en: "Don't wish for it, work for it.", ar: 'لا تتمنّاه، اعمل لأجله.', tr: 'Dileme, çalış.' },
  { en: 'One more rep. Always one more.', ar: 'تكرار واحد إضافي. دائماً واحد إضافي.', tr: 'Bir tekrar daha. Hep bir tekrar daha.' },
  { en: 'Your body can. Convince your mind.', ar: 'جسمك يقدر. أقنع عقلك.', tr: 'Bedenin yapabilir. Aklını ikna et.' },
  { en: 'Show up even when you don’t feel like it.', ar: 'احضر حتى لو ما كان عندك مزاج.', tr: 'Canın istemese bile yine de gel.' },
  { en: 'Sweat now, shine later.', ar: 'اعرق اليوم، تتألق غداً.', tr: 'Bugün terle, sonra parla.' },
  { en: 'Discipline beats motivation.', ar: 'الانضباط يغلب الحماس.', tr: 'Disiplin motivasyonu yener.' },
  { en: 'Small steps every day.', ar: 'خطوات صغيرة كل يوم.', tr: 'Her gün küçük adımlar.' },
  { en: 'The only bad workout is the one you skipped.', ar: 'التمرين الوحيد السيّئ هو اللي فوّتّه.', tr: 'Tek kötü antrenman, kaçırdığındır.' },
  { en: 'Stronger than yesterday.', ar: 'أقوى من الأمس.', tr: 'Dünden daha güçlü.' },
  { en: 'Be the hardest worker in the room.', ar: 'كن أكثر واحد يجتهد بالمكان.', tr: 'Salondaki en çok çalışan ol.' },
  { en: 'Eat clean, train mean.', ar: 'كُل صحّي، تمرّن بجد.', tr: 'Temiz ye, sıkı çalış.' },
  { en: 'Excuses don’t burn calories.', ar: 'الأعذار ما بتحرق سعرات.', tr: 'Bahaneler kalori yakmaz.' },
  { en: 'Trust the process.', ar: 'ثق بالعملية.', tr: 'Sürece güven.' },
  { en: 'Make yourself proud today.', ar: 'خلّي نفسك فخور فيك اليوم.', tr: 'Bugün kendinle gurur duy.' },
  { en: 'Push past the comfort zone.', ar: 'اطلع برّا منطقة الراحة.', tr: 'Konfor alanının ötesine geç.' },
  { en: 'Consistency is king.', ar: 'الاستمرارية هي الملك.', tr: 'İstikrar her şeydir.' },
  { en: 'Results live outside your comfort zone.', ar: 'النتائج برّا منطقة راحتك.', tr: 'Sonuçlar konfor alanının dışında.' },
  { en: 'Train like a beast, look like a beauty.', ar: 'تمرّن كالوحش.', tr: 'Canavar gibi çalış.' },
  { en: 'Fall in love with the grind.', ar: 'احبّ التعب.', tr: 'Çabaya âşık ol.' },
  { en: 'No shortcuts. Just reps.', ar: 'ما في طرق مختصرة. بس تكرارات.', tr: 'Kestirme yok. Sadece tekrar.' },
  { en: 'Earn your body.', ar: 'اكسب جسمك.', tr: 'Bedenini hak et.' },
  { en: 'Sore today, strong tomorrow.', ar: 'وجع اليوم، قوة بكرا.', tr: 'Bugün ağrı, yarın güç.' },
  { en: 'Win the morning, win the day.', ar: 'اربح صباحك، تربح يومك.', tr: 'Sabahı kazan, günü kazan.' },
  { en: 'Be stronger than your excuses.', ar: 'كن أقوى من أعذارك.', tr: 'Bahanelerinden güçlü ol.' },
  { en: 'The pain you feel today is the strength you feel tomorrow.', ar: 'الألم اليوم هو القوة بكرا.', tr: 'Bugünkü acı, yarınki güç.' },
  { en: 'Don’t count the days, make the days count.', ar: 'لا تعدّ الأيام، خلّي الأيام تتعدّ.', tr: 'Günleri sayma, günleri değerli kıl.' },
  { en: 'Go hard or go home.', ar: 'إمّا بجد أو ارجع البيت.', tr: 'Ya tam ver ya da eve git.' },
  { en: 'Your future self is watching.', ar: 'نسختك المستقبلية تراقبك.', tr: 'Gelecekteki sen izliyor.' },
  { en: 'Today’s effort is tomorrow’s strength.', ar: 'مجهود اليوم قوة بكرا.', tr: 'Bugünün emeği yarının gücü.' },
];

export const WEEKLY_QUOTES: Quote[] = [
  { en: 'New week, new chance to be stronger.', ar: 'أسبوع جديد، فرصة جديدة لتكون أقوى.', tr: 'Yeni hafta, daha güçlü olma şansı.' },
  { en: 'Plan the week, win the week.', ar: 'خطّط الأسبوع، تربح الأسبوع.', tr: 'Haftayı planla, haftayı kazan.' },
  { en: 'Five workouts. No negotiations.', ar: 'خمس تمارين. بلا نقاش.', tr: 'Beş antrenman. Pazarlık yok.' },
  { en: 'Be 1% better every day this week.', ar: 'كن أحسن 1% كل يوم هالأسبوع.', tr: 'Bu hafta her gün %1 daha iyi ol.' },
  { en: 'This week, beat last week.', ar: 'هالأسبوع، اغلب الأسبوع اللي راح.', tr: 'Bu hafta geçen haftayı geç.' },
  { en: 'Show up seven days, no zeros.', ar: 'احضر سبع أيام، بلا أصفار.', tr: 'Yedi gün gel, sıfır yok.' },
  { en: 'Build the habit, not the excuse.', ar: 'ابنِ العادة، مو العذر.', tr: 'Alışkanlığı inşa et, bahaneyi değil.' },
  { en: 'A strong week starts with a strong Monday.', ar: 'الأسبوع القوي يبدأ من إثنين قوي.', tr: 'Güçlü hafta güçlü Pazartesi ile başlar.' },
  { en: 'Outwork the person you were last week.', ar: 'اجتهد أكثر من نسختك الأسبوع الماضي.', tr: 'Geçen haftaki kendinden fazla çalış.' },
  { en: 'Progress, not perfection, this week.', ar: 'تقدّم، مو كمال، هالأسبوع.', tr: 'Bu hafta mükemmellik değil ilerleme.' },
  { en: 'Stay consistent when motivation fades.', ar: 'ضل ثابت لما يخفّ الحماس.', tr: 'Motivasyon bitince istikrarlı kal.' },
  { en: 'Seven days to a stronger you.', ar: 'سبع أيام لنسخة أقوى منك.', tr: 'Daha güçlü bir sen için yedi gün.' },
];

export const MONTHLY_QUOTES: Quote[] = [
  { en: 'Every month you train builds you.', ar: 'كل شهر تتمرن فيه يبنيك.', tr: 'Antrenman yaptığın her ay seni inşa eder.' },
  { en: 'A month of effort changes everything.', ar: 'شهر من المجهود يغيّر كل شي.', tr: 'Bir aylık emek her şeyi değiştirir.' },
  { en: 'Consistency over a month beats intensity for a day.', ar: 'الثبات شهر يغلب الشدّة يوم.', tr: 'Bir aylık istikrar, bir günlük yoğunluğu yener.' },
  { en: 'This month, become undeniable.', ar: 'هالشهر، صير لا يمكن تجاهلك.', tr: 'Bu ay yadsınamaz biri ol.' },
  { en: 'Small habits, big monthly results.', ar: 'عادات صغيرة، نتائج شهرية كبيرة.', tr: 'Küçük alışkanlıklar, büyük aylık sonuçlar.' },
  { en: 'Thirty days to a new standard.', ar: 'ثلاثين يوم لمعيار جديد.', tr: 'Yeni bir standart için otuz gün.' },
  { en: 'Your body keeps the score of this month.', ar: 'جسمك يسجّل كل هالشهر.', tr: 'Bedenin bu ayı kaydeder.' },
  { en: 'Show up all month, surprise yourself.', ar: 'احضر الشهر كله، تفاجئ نفسك.', tr: 'Tüm ay gel, kendini şaşırt.' },
  { en: 'Discipline this month, freedom next.', ar: 'انضباط هالشهر، حرية الجاي.', tr: 'Bu ay disiplin, gelecek ay özgürlük.' },
  { en: 'Make this month your best yet.', ar: 'خلّي هالشهر أفضل شهر إلك.', tr: 'Bu ayı en iyi ayın yap.' },
  { en: 'One month closer to your goal.', ar: 'شهر أقرب لهدفك.', tr: 'Hedefine bir ay daha yakın.' },
  { en: 'Train this month like it matters — it does.', ar: 'تمرّن هالشهر كأنه مهم — لأنه مهم.', tr: 'Bu ay önemliymiş gibi çalış — çünkü öyle.' },
];

function dayOfYear(d = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

export function dailyQuote(d = new Date()): Quote {
  return DAILY_QUOTES[dayOfYear(d) % DAILY_QUOTES.length];
}
export function weeklyQuote(d = new Date()): Quote {
  return WEEKLY_QUOTES[Math.floor(dayOfYear(d) / 7) % WEEKLY_QUOTES.length];
}
export function monthlyQuote(d = new Date()): Quote {
  return MONTHLY_QUOTES[d.getMonth() % MONTHLY_QUOTES.length];
}
