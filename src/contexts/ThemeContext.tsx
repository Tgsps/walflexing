import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useApp } from '../state/AppContext';
import type { ThemeId } from '../types';
import { DEFAULT_THEME } from '../styles/themes';

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Convenience wrapper around the app settings: exposes the current color theme
 * and a setter. Persistence + applying `data-theme` to <html> is handled by
 * AppContext (single source of truth in localStorage under settings.colorTheme).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { data, update } = useApp();
  const theme = data.settings.colorTheme ?? DEFAULT_THEME;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: (t: ThemeId) => update((d) => { d.settings.colorTheme = t; }),
    }),
    [theme, update],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
