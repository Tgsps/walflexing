import { Volume2 } from 'lucide-react';
import { wordOfToday } from '../data/turkishWords';
import Card from './Card';

export default function WordCard() {
  const { word, index, total } = wordOfToday();

  const speak = () => {
    try {
      const u = new SpeechSynthesisUtterance(word.tr);
      u.lang = 'tr-TR';
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch {
      /* غير مدعوم */
    }
  };

  return (
    <Card className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-black text-green">🗣️ كلمة اليوم</span>
        <span className="text-xs font-bold text-muted">
          {word.emoji} {word.category}
        </span>
      </div>

      <div className="text-center py-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl font-black text-ink" dir="ltr">
            {word.tr}
          </span>
          <button onClick={speak} className="text-green active:scale-90" aria-label="نطق">
            <Volume2 size={20} />
          </button>
        </div>
        <div className="text-gold font-black mt-1">{word.ar}</div>
        <div className="text-sm text-muted font-bold mt-0.5">النطق: {word.pron}</div>
      </div>

      <div className="text-xs font-bold text-muted text-center border-t border-line pt-2 num">
        الكلمة {index} من {total}
      </div>
    </Card>
  );
}
