# Walflex

**Your life. Your wallet. Your Istanbul.**

An installable, **offline-first PWA** for one young man living in Istanbul to manage **salary, expenses, food, workouts, clothes, medication, prices, and prayer** — all in one place, on the phone, with no account and no internet required.

- 🌍 **Three languages** — English (default) · العربية · Türkçe (full RTL for Arabic)
- 💱 Turkish Lira (₺) + US Dollar ($), exchange rate editable by hand (or auto via a keyless API)
- 📴 **Works 100% offline** — all data lives in `localStorage`. No backend, no login.
- 🎬 **Intro video** plays full-screen every time the app opens
- ✏️ Prices are edited manually from the Prices screen

---

## Run locally

```bash
npm install      # one time
npm run dev      # start the dev server (usually http://localhost:5173)
```

Other commands:

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
npm run typecheck  # TypeScript type-check
```

> PWA icons (`public/pwa-192x192.png`, `pwa-512x512.png`, `maskable-512x512.png`, `apple-touch-icon.png`) are committed static assets generated from `public/logo.svg`. The favicon is `public/favicon.svg`.

---

## Branding & intro video

- **Logo:** `public/logo.svg` — gold suspension bridge + white "W" over a gold wallet on emerald green. Used in the navbar, language picker, PWA icons, and favicon.
- **Intro splash:** `src/components/IntroSplash.tsx` plays `public/intro.mp4` full-screen on **every** open (state is in-memory only, so a refresh or relaunch replays it). It autoplays muted + `playsInline` (iOS-safe), `object-fit: cover`, no controls, no skip button. The Walflex logo fades in over the last ~1s, then the video fades out (0.5s) and the app appears. If autoplay is blocked, the video errors, or it stalls, the splash skips gracefully to the app.

> To swap the video, just replace `public/intro.mp4` — it is referenced by path (`src="/intro.mp4"`), not imported.

---

## Deploy to Netlify

Settings are ready in `netlify.toml`:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- SPA redirects are configured (`public/_redirects` + `netlify.toml`) so react-router works on refresh.

**Via Git (easiest):** push to GitHub, then in Netlify choose *Add new site → Import from Git* and pick the repo — it auto-detects the settings.

**Via CLI:**
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

> ⚠️ PWA install + service worker only work over **HTTPS** — provided automatically by Netlify.

---

## Install on iPhone 📲

1. Open the published URL in **Safari** (Safari specifically).
2. Tap the **Share** button (square with an up-arrow).
3. Choose **Add to Home Screen**.
4. Tap **Add** — the Walflex icon appears on your home screen.
5. Open it from the icon — it runs full-screen and offline.

> The app shows this guide automatically the first time, and it's always available from **Settings → How to install on iPhone**.

---

## Screens

| Screen | What it does |
|---|---|
| 🏠 Dashboard | Salary in $/₺, remaining balance, progress bar, three cards (fixed / purchases / expected), donut breakdown, bill reminders, daily-spend calculator, quick notes, identity card, weather + outfit, M2 metro card, Turkish word of the day, daily verse |
| 💸 Expenses | Fixed costs (+ custom items) · expected log with category filters (day/week/month) · month-over-month comparison |
| 🍽️ Food | Weekly groceries checklist (feeds "spent on groceries") · meal plan (breakfast/lunch/dinner) with recipes |
| 🏋️ Workouts | Weekly schedule (today highlighted, commitment indicator, streak) · weight tracking with trend chart · motivational quotes |
| 👔 Clothes | My wardrobe (owned items by category/condition, gender-aware) · shopping list (by priority; "bought it" moves it into the wardrobe) · suggested shops · monthly clothing budget |
| 💊 Medicines | (opens from Settings) meds/vitamins with times + "taken today" checkbox + reminder notifications (PWA) |
| 🏷️ Prices | Standalone price list with quick inline editing of every price |
| 🕌 Prayer | "Your prayer, your life" — prayer times (Aladhan, Diyanet method) + countdown to the next prayer + morning/evening adhkar with daily-resetting counters |
| ⚙️ Settings | Profile (name + photo), gender, theme (light/dark/auto), PIN + biometric lock, salary, exchange rate, clothing budget, price table, JSON export/import, reset for a new month, language |

---

## Online features (keyless, offline-tolerant)

Three free, no-key public APIs are used — each is fetched once, cached locally, and falls back to the last saved value when offline:

- **Open-Meteo** — Istanbul weather (drives the outfit suggestion)
- **Frankfurter** — daily ₺/$ exchange rate (with up/down/stable status)
- **Aladhan** — prayer times (Diyanet method; needs location permission)

Everything else runs fully offline. Notifications work best after installing as a PWA.

> ⚠️ **Religious content:** Qur'an verses and adhkar are written carefully with references, but **review them yourself before publishing.**

---

## Visual identity — "Hot Virginia"

Deep emerald `#062D23` × burnt gold `#C49418` × warm ivory `#F8F4EA` (a five-star hotel lobby).

- Floating bottom nav ("Pill Island") — centered capsule, active tab a gold pill with icon + label.
- Cards with a **bottom** gold edge + warm shadows; a luxe gradient identity card with a gold ring.
- Matching light/dark modes, glowing gradient progress bar, bottom-sheet modals with a drag handle.
- Inter for Latin, Tajawal for Arabic; `tabular-nums`; full RTL.

---

## Themes

Seven color palettes, switchable instantly from **Settings → 🎨 Theme** (persisted in `settings.colorTheme`, default **Emerald**):

| Theme | Mode | Feel |
|---|---|---|
| **Emerald** | light | the default "Hot Virginia" emerald × gold |
| **Neon Night** | dark | violet + cyan neon on near-black, glowing cards |
| **Campus** | light | navy + amber, clean and academic |
| **Rose Gold** | light | wine rose + gold |
| **Blossom Neon** | dark | hot-pink + purple neon, glowing cards |
| **Minimal** | light | monochrome black/white + a gold accent |
| **Clay** | light | warm terracotta + amber *(placeholder — see note)* |

How it works:

- Every color is an RGB-triple CSS variable; palettes are applied as `[data-theme="…"]` on `<html>` ([src/styles/themes.ts](src/styles/themes.ts), CSS in [src/index.css](src/index.css)). All components use semantic tokens (`bg-card`, `text-ink`, `bg-green`…), so they re-theme automatically — no hardcoded colors.
- The existing **light/dark/auto** toggle still works and composes with themes: dark themes (Neon Night, Blossom) ignore it; light themes get a darkened variant when dark mode is on. *Theme choice overrides the dark-mode setting.*
- A tiny inline script in [index.html](index.html) applies the saved theme before React mounts, so there's no flash of the default palette.
- `ThemeContext` ([src/contexts/ThemeContext.tsx](src/contexts/ThemeContext.tsx)) exposes `useTheme()`; the picker is [src/components/ThemePicker.tsx](src/components/ThemePicker.tsx).

> **Note on "Clay" (`design-1`):** this slot was meant to come from a Claude Design share link, but that link returned 404 (expired), so Clay is a tasteful placeholder. Provide a working design link and it can be swapped in.

---

## i18n

- English (default) · Arabic · Turkish via i18next + react-i18next.
- A language picker appears on first run (onboarding step 0) and can be changed later in Settings.
- Switching is instant — no reload, no data loss. Arabic = RTL + Tajawal; English/Turkish = LTR + Inter.
- Currency stays ₺ and $ in every language. Dates: M/D for English, D/M for Arabic & Turkish.
- Translation files live in `src/i18n/locales/{en,ar,tr}.json`. Stored content (meals, recipes, groceries, prices…) is canonical and translated at render time via stable key-maps in `src/i18n/content.ts` — no data or logic is duplicated per language.

---

## Tech

React + Vite + TypeScript · Tailwind CSS · react-router-dom · Recharts · lucide-react · vite-plugin-pwa.
