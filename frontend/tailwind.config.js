/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#FF2A2A',
          redHover: '#E01F1F',
          dark: '#0B0E14',
          card: '#131824',
          charcoal: '#1C2333',
          border: '#2A344A',
          silver: '#94A3B8',
          gold: '#F59E0B',
          glow: 'rgba(255, 42, 42, 0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        redGlow: '0 0 25px rgba(255, 42, 42, 0.35)',
        silverGlow: '0 0 20px rgba(148, 163, 184, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'red-gradient': 'linear-gradient(135deg, #FF2A2A 0%, #B91C1C 100%)',
      },
    },
  },
  plugins: [],
};
