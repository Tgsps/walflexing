/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#0E4D3C',
          2: '#15614C',
          3: '#1C7A60',
        },
        gold: {
          DEFAULT: '#C9A227',
          soft: '#F3E7C4',
        },
        cream: '#FBF8F1',
        card: '#FFFFFF',
        ink: '#1E2A24',
        muted: '#6E7A72',
        line: '#E7E1D3',
        ok: '#2E9E6B',
        warn: '#E0A92E',
        danger: '#D9534F',
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
