import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AppData } from '../types';
import { loadData, saveData } from '../lib/storage';
import { createSeedData } from '../data/seed';

interface AppContextValue {
  data: AppData;
  /** تعديل غير متحوّل (immutable) عبر نسخة قابلة للتعديل */
  update: (mutator: (draft: AppData) => void) => void;
  /** استبدال كامل البيانات (استيراد) */
  replace: (next: AppData) => void;
  /** إعادة ضبط لشهر جديد: يصفّر المتغيّرة والمشتريات وحالة الوجبات */
  resetForNewMonth: () => void;
  /** إعادة كل شيء للبيانات الأولية */
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function deepClone<T>(obj: T): T {
  if (typeof structuredClone === 'function') return structuredClone(obj);
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());
  const firstRender = useRef(true);

  // حفظ تلقائي عند أي تغيير
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    saveData(data);
  }, [data]);

  const update = useCallback((mutator: (draft: AppData) => void) => {
    setData((prev) => {
      const draft = deepClone(prev);
      mutator(draft);
      return draft;
    });
  }, []);

  const replace = useCallback((next: AppData) => setData(next), []);

  const resetForNewMonth = useCallback(() => {
    setData((prev) => {
      const draft = deepClone(prev);
      draft.variableExpenses = [];
      draft.shopping.weeks = draft.shopping.weeks.map((w) => ({ ...w, checkedIds: [] }));
      draft.meals.weeks = draft.meals.weeks.map((w) => ({
        ...w,
        days: w.days.map((d) => ({
          ...d,
          done: { breakfast: false, lunch: false, dinner: false },
        })),
      }));
      return draft;
    });
  }, []);

  const resetAll = useCallback(() => setData(createSeedData()), []);

  const value = useMemo<AppContextValue>(
    () => ({ data, update, replace, resetForNewMonth, resetAll }),
    [data, update, replace, resetForNewMonth, resetAll],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
