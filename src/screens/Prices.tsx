import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Check } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { fmtTRY } from '../lib/format';
import { tPriceName, tPriceUnit } from '../i18n/content';

export default function Prices() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const [editing, setEditing] = useState<string | null>(null);

  const setPrice = (id: string, val: number) =>
    update((d) => {
      const it = d.prices.find((x) => x.id === id);
      if (it) it.priceTRY = val;
    });

  return (
    <div>
      <header className="flex items-center gap-3 mb-5">
        <Link
          to="/settings"
          className="w-10 h-10 shrink-0 grid place-items-center rounded-xl bg-card border border-line text-green active:scale-95"
          aria-label={t('common.back')}
        >
          <ArrowLeft size={20} className="rtl:rotate-180" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-green leading-tight">🏷️ {t('prices.title')}</h1>
          <div className="gold-rule mt-1.5" />
        </div>
      </header>

      <p className="text-xs text-muted font-bold mb-3">{t('settings.pricesNote')}</p>

      <ul className="space-y-2 fade-up">
        {data.prices.map((p) => {
          const isEditing = editing === p.id;
          return (
            <li key={p.id} className="bg-card rounded-2xl border border-line p-3 flex items-center gap-3">
              <span className="text-2xl shrink-0" aria-hidden>
                {p.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-ink truncate">{tPriceName(p.id, t, p.name)}</div>
                <div className="text-xs text-muted font-bold">{tPriceUnit(p.id, t, p.unit)}</div>
              </div>
              {isEditing ? (
                <div className="flex items-center gap-1 shrink-0">
                  <input
                    type="number"
                    inputMode="numeric"
                    autoFocus
                    value={p.priceTRY || ''}
                    onChange={(e) => setPrice(p.id, Number(e.target.value) || 0)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditing(null)}
                    className="w-20 bg-cream/60 border-2 border-gold rounded-lg px-2 py-1.5 text-end font-black text-green num focus:outline-none"
                  />
                  <span className="text-muted font-black text-sm">₺</span>
                  <button
                    onClick={() => setEditing(null)}
                    className="w-8 h-8 grid place-items-center rounded-lg bg-green text-white active:scale-95"
                    aria-label={t('common.done')}
                  >
                    <Check size={16} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(p.id)}
                  className="flex items-center gap-2 shrink-0 active:scale-95"
                  aria-label={t('common.edit')}
                >
                  <span className="font-black text-green num">{fmtTRY(p.priceTRY)}</span>
                  <span className="w-8 h-8 grid place-items-center rounded-lg border-2 border-gold/60 text-green">
                    <Pencil size={15} />
                  </span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
