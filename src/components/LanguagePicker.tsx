import { useState } from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { LANGS, LANG_META, type Lang } from '../i18n';

// Title + confirm shown in all three languages (the user can't read the UI yet).
const TITLES: Record<Lang, string> = {
  en: 'Choose your language',
  ar: 'اختر لغتك',
  tr: 'Dilinizi seçin',
};
const CONFIRM: Record<Lang, string> = {
  en: "Let's go",
  ar: 'هيا',
  tr: 'Hadi başlayalım',
};

export default function LanguagePicker({ onConfirm }: { onConfirm: () => void }) {
  const { data, update } = useApp();
  const [selected, setSelected] = useState<Lang>(data.settings.language || 'en');

  const pick = (lang: Lang) => {
    setSelected(lang);
    // apply live so the rest of onboarding is already in this language
    update((d) => {
      d.settings.language = lang;
    });
  };

  return (
    <div className="fixed inset-0 z-[70] bg-cream overflow-y-auto" dir="ltr">
      <div className="max-w-[480px] mx-auto px-6 py-10 safe-top min-h-full flex flex-col">
        {/* logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.svg" alt="Walflex" className="w-24 h-24 rounded-[22px] shadow-card mb-4" />
          <div className="space-y-1 text-center">
            {LANGS.map((l) => (
              <div
                key={l}
                className={`font-black ${l === selected ? 'text-green text-xl' : 'text-muted text-sm'}`}
                dir={l === 'ar' ? 'rtl' : 'ltr'}
              >
                {TITLES[l]}
              </div>
            ))}
          </div>
        </div>

        {/* cards */}
        <div className="flex-1 space-y-3">
          {LANGS.map((l) => {
            const on = selected === l;
            return (
              <button
                key={l}
                onClick={() => pick(l)}
                className={`w-full flex items-center gap-4 rounded-[18px] border-2 p-4 transition active:scale-[.99] ${
                  on ? 'border-gold bg-gold/10 shadow-soft' : 'border-line bg-card'
                }`}
              >
                <span style={{ fontSize: 40 }} aria-hidden>
                  {LANG_META[l].flag}
                </span>
                <span
                  className={`flex-1 text-start font-black text-lg ${on ? 'text-green' : 'text-ink'}`}
                  dir={l === 'ar' ? 'rtl' : 'ltr'}
                >
                  {LANG_META[l].native}
                </span>
                <span
                  className={`w-7 h-7 rounded-full grid place-items-center border-2 ${
                    on ? 'bg-gold border-gold text-green' : 'border-line text-transparent'
                  }`}
                >
                  <Check size={16} strokeWidth={3} />
                </span>
              </button>
            );
          })}
        </div>

        {/* confirm */}
        <button onClick={onConfirm} className="btn-primary w-full mt-8 flex flex-col items-center gap-0.5 py-4">
          <span className="text-base">{CONFIRM[selected]}</span>
          <span className="text-[11px] font-medium text-white/60">
            {LANGS.filter((l) => l !== selected)
              .map((l) => CONFIRM[l])
              .join(' · ')}
          </span>
        </button>
      </div>
    </div>
  );
}
