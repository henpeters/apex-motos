/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#FF2A2A',
          redHover: '#E01F1F',
          dark: '#090B10',
          card: '#111520',
          charcoal: '#1A2130',
          border: '#273146',
          silver: '#94A3B8',
          gold: '#F59E0B',
          glow: 'rgba(255, 42, 42, 0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
