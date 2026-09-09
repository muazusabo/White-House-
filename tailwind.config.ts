import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#22301F',
        paper: '#F5EFE1',
        paperDim: '#EDE5D2',
        marigold: '#D98E04',
        marigoldDark: '#B37403',
        forest: '#2F6B4F',
        forestDark: '#234F3B',
        clay: '#B4482A',
        line: '#D8CDAF',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
      },
    },
  },
  plugins: [],
};

export default config;
