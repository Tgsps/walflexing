import { NavLink } from 'react-router-dom';
import { Home, Wallet, UtensilsCrossed, Dumbbell, Shirt, Settings } from 'lucide-react';

const items = [
  { to: '/', label: 'الرئيسية', Icon: Home, end: true },
  { to: '/expenses', label: 'المصاريف', Icon: Wallet, end: false },
  { to: '/food', label: 'الأكل', Icon: UtensilsCrossed, end: false },
  { to: '/workouts', label: 'التمارين', Icon: Dumbbell, end: false },
  { to: '/clothes', label: 'الملابس', Icon: Shirt, end: false },
  { to: '/settings', label: 'الإعدادات', Icon: Settings, end: false },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-card border-t border-line shadow-nav nav-safe">
      <ul className="max-w-[480px] mx-auto grid grid-cols-6">
        {items.map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-bold transition ${
                  isActive ? 'text-green' : 'text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`grid place-items-center w-10 h-7 rounded-full transition ${
                      isActive ? 'bg-gold-soft' : 'bg-transparent'
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.6 : 2} />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
