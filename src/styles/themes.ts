import type { ThemeId } from '../types';

/**
 * Theme registry — single source of truth for the palette picker.
 * The actual CSS variables live in `src/index.css` under `[data-theme="<id>"]`
 * (and `[data-theme="<id>"].dark` for the darkened variant of light themes).
 *
 * `dark: true`  → the theme is inherently dark; the light/dark toggle is ignored
 *                 for it (the theme overrides the dark-mode setting).
 * `swatch`      → three hexes used to draw the little preview dots in the picker.
 * `meta`        → <meta name="theme-color"> value in the theme's normal state.
 * `metaDark`    → status-bar color when a light theme is shown in dark mode.
 */
export interface ThemeDef {
  id: ThemeId;
  /** i18n key under `themes.*` */
  nameKey: string;
  dark: boolean;
  swatch: { primary: string; accent: string; bg: string };
  meta: string;
  metaDark?: string;
}

export const THEMES: ThemeDef[] = [
  {
    id: 'emerald',
    nameKey: 'themes.emerald',
    dark: false,
    swatch: { primary: '#062D23', accent: '#C49418', bg: '#F8F4EA' },
    meta: '#062D23',
    metaDark: '#08120E',
  },
  {
    id: 'neon-night',
    nameKey: 'themes.neon-night',
    dark: true,
    swatch: { primary: '#7B2FFF', accent: '#00D4FF', bg: '#0D0D1A' },
    meta: '#0D0D1A',
  },
  {
    id: 'campus',
    nameKey: 'themes.campus',
    dark: false,
    swatch: { primary: '#1E3A8A', accent: '#F59E0B', bg: '#F4F7FF' },
    meta: '#1E3A8A',
    metaDark: '#0B1220',
  },
  {
    id: 'rose-gold',
    nameKey: 'themes.rose-gold',
    dark: false,
    swatch: { primary: '#9D2449', accent: '#C9A227', bg: '#FFF5F7' },
    meta: '#9D2449',
    metaDark: '#1A0F14',
  },
  {
    id: 'blossom',
    nameKey: 'themes.blossom',
    dark: true,
    swatch: { primary: '#FF2D9B', accent: '#BF5AF2', bg: '#0F0A1E' },
    meta: '#0F0A1E',
  },
  {
    id: 'minimal',
    nameKey: 'themes.minimal',
    dark: false,
    swatch: { primary: '#111111', accent: '#C9A227', bg: '#FFFFFF' },
    meta: '#111111',
    metaDark: '#141414',
  },
  {
    id: 'design-1',
    nameKey: 'themes.design-1',
    dark: false,
    swatch: { primary: '#BD5D3A', accent: '#CC9544', bg: '#FBF6F0' },
    meta: '#BD5D3A',
    metaDark: '#1A130F',
  },
];

export const THEME_IDS: ThemeId[] = THEMES.map((t) => t.id);
const BY_ID = new Map(THEMES.map((t) => [t.id, t]));

export const DEFAULT_THEME: ThemeId = 'emerald';

export function getTheme(id: ThemeId | undefined): ThemeDef {
  return (id && BY_ID.get(id)) || BY_ID.get(DEFAULT_THEME)!;
}

export function isDarkTheme(id: ThemeId | undefined): boolean {
  return getTheme(id).dark;
}
