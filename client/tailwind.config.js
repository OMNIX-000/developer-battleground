/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tactical: {
          bg: '#05050c',
          panel: '#0a0a16',
          border: '#1c1c38',
          accent: '#22d3ee',
          alt: '#e879f9',
          danger: '#f43f5e',
          warn: '#f59e0b',
          info: '#38bdf8',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseborder: {
          '0%, 100%': { borderColor: 'rgba(34,211,238,0.4)' },
          '50%': { borderColor: 'rgba(34,211,238,1)' },
        },
      },
      animation: {
        scan: 'scan 3s linear infinite',
        flicker: 'flicker 2s ease-in-out infinite',
        radar: 'radar 4s linear infinite',
        pulseborder: 'pulseborder 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}