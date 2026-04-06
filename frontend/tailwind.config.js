/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        tarot: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"PingFang SC"', '"Helvetica Neue"', 'sans-serif'],
        reading: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"PingFang SC"', '"Helvetica Neue"', 'sans-serif'],
      },
      keyframes: {
        'card-arrive-left': {
          '0%':   { transform: 'translateX(-110vw) translateY(60vh) rotate(-30deg) scale(0.3)', opacity: '0' },
          '75%':  { transform: 'translateX(8px) translateY(0px) rotate(3deg) scale(1.08)', opacity: '1' },
          '100%': { transform: 'translateX(0px) translateY(0px) rotate(-6deg) scale(1)', opacity: '1' },
        },
        'card-arrive-top': {
          '0%':   { transform: 'translateY(-110vh) scale(0.3)', opacity: '0' },
          '75%':  { transform: 'translateY(8px) scale(1.08)', opacity: '1' },
          '100%': { transform: 'translateY(0px) scale(1)', opacity: '1' },
        },
        'card-arrive-right': {
          '0%':   { transform: 'translateX(110vw) translateY(60vh) rotate(30deg) scale(0.3)', opacity: '0' },
          '75%':  { transform: 'translateX(-8px) translateY(0px) rotate(-3deg) scale(1.08)', opacity: '1' },
          '100%': { transform: 'translateX(0px) translateY(0px) rotate(6deg) scale(1)', opacity: '1' },
        },
        'portal-burst': {
          '0%':   { transform: 'scale(0.1)', opacity: '0' },
          '20%':  { opacity: '1' },
          '100%': { transform: 'scale(6)', opacity: '0' },
        },
        'cards-glow-out': {
          '0%':   { opacity: '1', filter: 'brightness(1) blur(0px)' },
          '60%':  { opacity: '0.9', filter: 'brightness(5) blur(4px)' },
          '100%': { opacity: '0', filter: 'brightness(10) blur(12px)' },
        },
        'oracle-text-reveal': {
          '0%':   { opacity: '0', letterSpacing: '0.05em', transform: 'translateY(12px) scale(0.95)' },
          '100%': { opacity: '1', letterSpacing: '0.4em', transform: 'translateY(0px) scale(1)' },
        },
        'portal-fade-to-black': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'portal-geo-spin': {
          '0%':   { transform: 'rotate(0deg) scale(0.6)', opacity: '0' },
          '30%':  { opacity: '0.15' },
          '70%':  { opacity: '0.12' },
          '100%': { transform: 'rotate(60deg) scale(1.2)', opacity: '0' },
        },
      },
      animation: {
        'card-arrive-left':  'card-arrive-left 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.15s both',
        'card-arrive-top':   'card-arrive-top  0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.28s both',
        'card-arrive-right': 'card-arrive-right 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.40s both',
        'portal-burst':      'portal-burst 1.4s ease-out 0.9s both',
        'cards-glow-out':    'cards-glow-out 0.9s ease-in 1.6s both',
        'oracle-text-reveal':'oracle-text-reveal 0.9s ease-out 1.3s both',
        'portal-fade-to-black': 'portal-fade-to-black 0.75s ease-in 2.05s both',
        'portal-geo-spin':   'portal-geo-spin 2.8s ease-in-out 0s both',
      },
    }
  },
  plugins: [],
}

