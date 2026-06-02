import { useTranslation } from 'react-i18next';
import { Volume2 } from 'lucide-react';
import { wordOfToday } from '../data/turkishWords';
import { tWordCat } from '../i18n/content';
import Card from './Card';

export default function WordCard() {
  const { t } = useTranslation();
  const { word, index, total } = wordOfToday();

  const speak = () => {
    try {
      const u = new SpeechSynthesisUtterance(word.tr);
      u.lang = 'tr-TR';
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch {
      /* unsupported */
    }
  };

  return (
    <Card className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-black text-green" style={{ fontSize: 15 }}>
          {t('word.title')}
        </span>
        <span className="chip" style={{ padding: '4px 12px', fontSize: 12 }}>
          {word.emoji} {tWordCat(word.category, t)}
        </span>
      </div>

      <div className="text-center py-1.5">
        <div className="flex items-center justify-center gap-2.5">
          <span dir="ltr" className="font-black text-ink" style={{ fontSize: 24, letterSpacing: '.02em' }}>
            {word.tr}
          </span>
          <button
            onClick={speak}
            className="pulse-gold grid place-items-center text-green active:scale-90"
            style={{ width: 40, height: 40, borderRadius: 9999, border: '2px solid rgb(var(--gold))', background: 'transparent' }}
            aria-label={t('word.title')}
          >
            <Volume2 size={18} />
          </button>
        </div>
        <div dir="rtl" className="font-black mt-1.5" style={{ color: 'rgb(var(--gold))', fontSize: 20 }}>
          {word.ar}
        </div>
        <div dir="rtl" className="text-[13px] font-bold text-muted italic mt-0.5">
          {t('word.pronunciation', { p: word.pron })}
        </div>
      </div>

      <div className="rounded-full overflow-hidden" style={{ height: 4, background: 'rgb(var(--line))' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${(index / total) * 100}%`, background: 'rgb(var(--gold))' }}
        />
      </div>
      <div className="num text-center font-bold text-muted mt-1.5" style={{ fontSize: 11 }}>
        {t('word.counter', { i: index, total })}
      </div>
    </Card>
  );
}
