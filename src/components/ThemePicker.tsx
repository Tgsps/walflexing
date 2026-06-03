import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES } from '../styles/themes';
import Card from './Card';

/**
 * Theme palette picker (Settings). Horizontal scroll of preview cards; each
 * shows the theme's background + primary + accent. Tap applies instantly.
 */
export default function ThemePicker() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <Card className="mb-3">
      <h2 className="font-black text-green mb-3">{t('settings.themeColor')}</h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        {THEMES.map((th) => {
          const active = th.id === theme;
          return (
            <button
              key={th.id}
              onClick={() => setTheme(th.id)}
              className="shrink-0 flex flex-col items-center gap-1.5 w-[68px]"
              aria-pressed={active}
            >
              <span
                className={`relative grid place-items-center rounded-2xl transition active:scale-95 ${
                  active ? 'ring-2 ring-gold ring-offset-2 ring-offset-card' : ''
                }`}
                style={{
                  width: 56,
                  height: 56,
                  background: th.swatch.bg,
                  border: `1px solid ${active ? th.swatch.accent : 'rgb(var(--line))'}`,
                }}
              >
                {/* primary + accent dots */}
                <span className="flex items-center gap-1">
                  <span style={{ width: 16, height: 16, borderRadius: 999, background: th.swatch.primary }} />
                  <span style={{ width: 12, height: 12, borderRadius: 999, background: th.swatch.accent }} />
                </span>
                {active && (
                  <span
                    className="absolute -top-1.5 -end-1.5 grid place-items-center rounded-full"
                    style={{ width: 20, height: 20, background: 'rgb(var(--gold))' }}
                  >
                    <Check size={13} strokeWidth={3} className="text-green" />
                  </span>
                )}
              </span>
              <span
                className={`text-[11px] font-bold text-center leading-tight ${
                  active ? 'text-green' : 'text-muted'
                }`}
              >
                {t(th.nameKey)}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
