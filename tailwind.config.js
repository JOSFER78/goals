/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'Nunito', 'sans-serif'],
        sans: ['Nunito', 'Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'twinkle': 'twinkle 3s infinite ease-in-out',
        'pop-in': 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'aurora': 'aurora 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        popIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '80%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.6))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(34,211,238,0.9))' },
        },
        aurora: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
