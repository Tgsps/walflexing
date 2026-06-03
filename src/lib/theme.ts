import type { ThemeMode, ThemeId } from '../types';
import { getTheme, isDarkTheme } from '../styles/themes';

export function prefersDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function isDarkActive(mode: ThemeMode): boolean {
  return mode === 'dark' || (mode === 'system' && prefersDark());
}

/**
 * Apply the color palette + light/dark modifier to <html>.
 * - `data-theme` selects the palette.
 * - Inherently-dark themes (neon-night, blossom) ignore the dark-mode toggle
 *   (theme overrides dark mode). Light themes get a darkened variant via the
 *   `.dark` class when dark mode is active.
 * - Updates <meta name="theme-color"> so the iOS status bar matches.
 */
export function applyTheme(colorTheme: ThemeId | undefined, mode: ThemeMode): void {
  const def = getTheme(colorTheme);
  const root = document.documentElement;
  root.setAttribute('data-theme', def.id);

  // dark-mode darkening applies only to light themes
  const darkening = !isDarkTheme(colorTheme) && isDarkActive(mode);
  root.classList.toggle('dark', darkening);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', darkening ? def.metaDark ?? def.meta : def.meta);
}
