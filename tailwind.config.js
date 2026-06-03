/** @type {import('tailwindcss').Config} */
const rgb = (v) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: { DEFAULT: rgb('--green'), 2: rgb('--green-2'), 3: rgb('--green-3') },
        gold: { DEFAULT: rgb('--gold'), soft: rgb('--gold-soft') },
        cream: rgb('--cream'),
        card: rgb('--card'),
        ink: rgb('--ink'),
        muted: rgb('--muted'),
        line: rgb('--line'),
        ok: rgb('--ok'),
        warn: rgb('--warn'),
        danger: rgb('--danger'),
      },
      fontFamily: {
        sans: ['Tajawal', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        modal: '28px',
        field: '14px',
      },
      boxShadow: {
        card: '0 4px 24px rgb(var(--green) / .08), 0 1px 4px rgb(var(--green) / .04)',
        soft: '0 2px 12px rgb(var(--green) / .06)',
        nav: '0 8px 32px rgb(var(--green) / .20)',
        glow: '0 0 16px rgb(var(--gold) / .35)',
        'glow-green': '0 0 20px rgb(var(--green-3) / .4)',
      },
    },
  },
  plugins: [],
};
