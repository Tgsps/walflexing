import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { verseOfToday } from '../data/quran';

export default function QuranCard() {
  const { t, i18n } = useTranslation();
  const verse = useMemo(() => verseOfToday(), []);
  const lang = i18n.language;
  const translation = lang === 'tr' ? verse.tr : verse.en;

  return (
    <div
      className="fade-up mb-3 relative overflow-hidden"
      style={{
        borderRadius: 20,
        padding: 18,
        background: 'linear-gradient(135deg, rgb(var(--green-2)), rgb(var(--green)))',
        border: '1.5px solid rgb(var(--gold) / 0.7)',
        boxShadow: '0 6px 22px rgba(6,45,35,.22)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-black text-gold" style={{ fontSize: 14 }}>
          ☪️ {t('quran.title')}
        </span>
        <span className="num text-white/55 font-bold" style={{ fontSize: 11 }} dir="ltr">
          {verse.ref}
        </span>
      </div>

      <p
        dir="rtl"
        className="text-center text-white font-black leading-relaxed"
        style={{ fontFamily: "'Tajawal', serif", fontSize: 19 }}
      >
        ﴿ {verse.ar} ﴾
      </p>

      {lang !== 'ar' && (
        <>
          <p dir="ltr" className="text-center text-gold/90 italic mt-2" style={{ fontSize: 12 }}>
            {verse.latin}
          </p>
          <p className="text-center text-white/85 font-bold mt-1" style={{ fontSize: 13 }}>
            {translation}
          </p>
        </>
      )}
    </div>
  );
}
