/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // --- Bakery palette: warm chocolate, coffee, cream and beige ---
        chocolate: {
          50: '#F7F1EB',
          100: '#EBDCCB',
          200: '#D6B896',
          300: '#BE9264',
          400: '#9C6F43',
          500: '#7B532F',
          600: '#5E3E23',
          700: '#452D19',
          800: '#2E1D10',
          900: '#1B1009',
        },
        cream: {
          50: '#FFFDFA',
          100: '#FBF6EF',
          200: '#F5EBDD',
          300: '#EDDDC7',
          400: '#E2CBAC',
          500: '#D4B58C',
        },
        caramel: {
          300: '#E8B888',
          400: '#D99A5B',
          500: '#C67C3C',
          600: '#A6602A',
        },
        // Semantic keys — prefer these in components.
        primary: '#452D19', // dark chocolate
        secondary: '#F5EBDD', // beige / cream
        accent: '#C67C3C', // warm caramel
        surface: '#FBF6EF',
        ink: '#2E1D10',
        muted: '#8A7460',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Softer corners than Tailwind's defaults.
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.75rem',
      },
      boxShadow: {
        // Layered, low-opacity shadows read softer than a single hard drop.
        soft: '0 2px 6px -2px rgba(69,45,25,0.08), 0 12px 28px -12px rgba(69,45,25,0.18)',
        lift: '0 4px 10px -4px rgba(69,45,25,0.10), 0 28px 55px -20px rgba(69,45,25,0.35)',
        inset: 'inset 0 1px 0 0 rgba(255,253,250,0.7)',
        glow: '0 0 0 1px rgba(198,124,60,0.18), 0 18px 40px -18px rgba(198,124,60,0.5)',
      },
      backgroundImage: {
        'chocolate-gradient':
          'linear-gradient(135deg, #452D19 0%, #7B532F 55%, #A6602A 100%)',
        'cream-gradient':
          'linear-gradient(180deg, #FFFDFA 0%, #FBF6EF 45%, #F5EBDD 100%)',
        'caramel-gradient':
          'linear-gradient(135deg, #E8B888 0%, #C67C3C 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
};
