import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#111111',
        surface: '#1A1A1A',
        text: '#F2F2F2',
        accent: '#D4AF37',
        error: '#EF4444',
        muted: '#2A2A2A',
      },
    },
  },
  plugins: [],
};

export default config;
