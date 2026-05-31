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
        card: '18px',
      },
      boxShadow: {
        card: '0 6px 20px rgba(14,77,60,.07)',
        soft: '0 2px 10px rgba(14,77,60,.06)',
        nav: '0 -4px 20px rgba(14,77,60,.08)',
      },
    },
  },
  plugins: [],
};
