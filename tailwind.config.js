/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        dark: {
          900: '#050a0e',
          800: '#0a1118',
          700: '#0f1a24',
          600: '#162130',
          500: '#1e2d3d',
          400: '#2a3f54',
          300: '#3d5a75',
        }
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px #ef4444, 0 0 20px #ef444433' },
          '50%':       { boxShadow: '0 0 15px #ef4444, 0 0 40px #ef444455' },
        },
        slideIn: {
          from: { transform: 'translateY(-10px)', opacity: 0 },
          to:   { transform: 'translateY(0)',     opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(0,229,102,0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0,229,102,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
