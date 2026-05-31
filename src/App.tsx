import { Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import InstallHint from './components/InstallHint';
import Dashboard from './screens/Dashboard';
import Expenses from './screens/Expenses';
import Food from './screens/Food';
import Workouts from './screens/Workouts';
import Settings from './screens/Settings';

export default function App() {
  return (
    <div className="min-h-full">
      <main className="max-w-[480px] mx-auto px-4 pt-5 pb-safe safe-top">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/food" element={<Food />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
      <BottomNav />
      <InstallHint />
    </div>
  );
}
