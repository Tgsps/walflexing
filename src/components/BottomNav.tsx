import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Wallet, UtensilsCrossed, Dumbbell, Shirt, Settings } from 'lucide-react';

const items = [
  { to: '/', key: 'home', Icon: Home, end: true },
  { to: '/expenses', key: 'expenses', Icon: Wallet, end: false },
  { to: '/food', key: 'food', Icon: UtensilsCrossed, end: false },
  { to: '/workouts', key: 'workouts', Icon: Dumbbell, end: false },
  { to: '/clothes', key: 'clothes', Icon: Shirt, end: false },
  { to: '/settings', key: 'settings', Icon: Settings, end: false },
];

export default function BottomNav() {
  const { t } = useTranslation();
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
    >
      <nav className="pointer-events-auto max-w-[360px] w-[calc(100%-32px)] flex items-center justify-between gap-1 rounded-[28px] bg-green/95 backdrop-blur-xl shadow-nav ring-1 ring-white/10 px-2.5 py-2">
        {items.map(({ to, key, Icon, end }) => {
          const label = t(`nav.${key}`);
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-1.5 shrink-0 rounded-full bg-gold/20 text-gold px-3.5 py-2'
                  : 'flex-1 flex flex-col items-center text-white/50 py-1.5 active:scale-90 transition'
              }
              aria-label={label}
            >
              {({ isActive }) => (
                <>
                  <Icon size={21} strokeWidth={isActive ? 2.6 : 2} />
                  {isActive && <span className="text-[13px] font-extrabold">{label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
