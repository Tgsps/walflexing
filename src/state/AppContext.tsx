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
import { snapshotForCurrentMonth } from '../lib/calc';
import { applyTheme } from '../lib/theme';
import { applyLangDir } from '../lib/langdir';
import i18n from '../i18n';

interface AppContextValue {
  data: AppData;
  /** تعديل غير متحوّل (immutable) عبر نسخة قابلة للتعديل */
  update: (mutator: (draft: AppData) => void) => void;
  /** استبدال كامل البيانات (استيراد) */
  replace: (next: AppData) => void;
  /** إعادة ضبط لشهر جديد: يصوّر الشهر الحالي ثم يصفّر المتغيّرة والمشتريات والوجبات */
  resetForNewMonth: () => void;
  /** حفظ لقطة للشهر الحالي في السجل (بدون تصفير) */
  snapshotMonth: () => void;
  /** إعادة كل شيء للبيانات الأولية */
  resetAll: () => void;
}

function upsertSnapshot(draft: AppData) {
  const snap = snapshotForCurrentMonth(draft);
  const idx = draft.monthlyHistory.findIndex((m) => m.month === snap.month);
  if (idx >= 0) draft.monthlyHistory[idx] = snap;
  else draft.monthlyHistory.push(snap);
  draft.monthlyHistory.sort((a, b) => a.month.localeCompare(b.month));
}

const AppContext = createContext<AppContextValue | null>(null);

function deepClone<T>(obj: T): T {
  if (typeof structuredClone === 'function') return structuredClone(obj);
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    loadData().then((d) => setData(d));
  }, []);

  // حفظ تلقائي عند أي تغيير (Debounced)
  useEffect(() => {
    if (!data) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      saveData(data);
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  // تطبيق اللغة + الاتجاه (RTL/LTR) فوراً عند التغيير
  useEffect(() => {
    if (!data) return;
    const lang = data.settings.language;
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    applyLangDir(lang);
  }, [data?.settings.language]);

  // تطبيق الثيم (لوحة الألوان + فاتح/داكن/تلقائي) + متابعة تغيّر النظام
  useEffect(() => {
    if (!data) return;
    const { colorTheme, theme } = data.settings;
    applyTheme(colorTheme, theme);
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme(colorTheme, 'system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [data?.settings.theme, data?.settings.colorTheme]);

  const update = useCallback((mutator: (draft: AppData) => void) => {
    setData((prev) => {
      if (!prev) return prev;
      const draft = deepClone(prev);
      mutator(draft);
      return draft;
    });
  }, []);

  const replace = useCallback((next: AppData) => setData(next), []);

  const snapshotMonth = useCallback(() => {
    setData((prev) => {
      if (!prev) return prev;
      const draft = deepClone(prev);
      upsertSnapshot(draft);
      return draft;
    });
  }, []);

  const resetForNewMonth = useCallback(() => {
    setData((prev) => {
      if (!prev) return prev;
      const draft = deepClone(prev);
      upsertSnapshot(draft); // صوّر الشهر قبل التصفير
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

  const value = useMemo<AppContextValue | null>(() => {
    if (!data) return null;
    return { data, update, replace, resetForNewMonth, snapshotMonth, resetAll };
  }, [data, update, replace, resetForNewMonth, snapshotMonth, resetAll]);

  if (!data || !value) {
    return <div className="fixed inset-0 bg-cream" />;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
