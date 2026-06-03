import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from './state/AppContext';
import BottomNav from './components/BottomNav';
import InstallHint from './components/InstallHint';
import Onboarding from './components/Onboarding';
import PinLock from './components/PinLock';
import EndOfDayModal from './components/EndOfDayModal';
import MedicineScheduler from './components/MedicineScheduler';
import PrayerScheduler from './components/PrayerScheduler';
import Dashboard from './screens/Dashboard';
import Expenses from './screens/Expenses';
import Food from './screens/Food';
import Workouts from './screens/Workouts';
import Clothes from './screens/Clothes';
import Medicines from './screens/Medicines';
import Prices from './screens/Prices';
import Prayer from './screens/Prayer';
import Settings from './screens/Settings';

const LOCK_MS = 5 * 60 * 1000;
const LAST_ACTIVE = 'last_active_at';

export default function App() {
  const { data } = useApp();
  const { onboardingDone, pinEnabled, pinHash } = data.settings;
  const lockable = pinEnabled && !!pinHash;

  const [locked, setLocked] = useState<boolean>(() => {
    if (!lockable) return false;
    const la = Number(localStorage.getItem(LAST_ACTIVE) || 0);
    return !la || Date.now() - la > LOCK_MS;
  });

  // متابعة النشاط: يقفل بعد 5 دقائق بالخلفية
  useEffect(() => {
    if (!lockable) return;
    const mark = () => localStorage.setItem(LAST_ACTIVE, String(Date.now()));
    mark();
    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        mark();
      } else {
        const la = Number(localStorage.getItem(LAST_ACTIVE) || 0);
        if (Date.now() - la > LOCK_MS) setLocked(true);
      }
    };
    const iv = setInterval(mark, 20000);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', mark);
    return () => {
      clearInterval(iv);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', mark);
    };
  }, [lockable]);

  if (!onboardingDone) return <Onboarding />;
  if (locked)
    return (
      <PinLock
        onUnlock={() => {
          localStorage.setItem(LAST_ACTIVE, String(Date.now()));
          setLocked(false);
        }}
      />
    );

  return (
    <div className="min-h-full">
      <main className="max-w-[480px] mx-auto px-5 pt-5 pb-safe safe-top">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/food" element={<Food />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/clothes" element={<Clothes />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/prayer" element={<Prayer />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
      <BottomNav />
      <InstallHint />
      <EndOfDayModal />
      <MedicineScheduler />
      <PrayerScheduler />
    </div>
  );
}
