import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1A1A',
        paper: '#F7F3EA',
        paperDim: '#EFE9DD',
        marigold: '#E89A00',
        marigoldDark: '#C77F00',
        forest: '#17351F',
        forestDark: '#102717',
        clay: '#EF4444',
        line: '#E5DED1',
        success: '#10B981',
        warning: '#F59E0B',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [],
};

export default config;
