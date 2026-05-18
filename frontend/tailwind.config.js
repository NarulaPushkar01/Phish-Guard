/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        black: 'rgb(var(--color-black) / <alpha-value>)',
        white: 'rgb(var(--color-text-main) / <alpha-value>)',
        gray: {
          100: 'rgb(var(--color-text-main) / <alpha-value>)',
          300: 'rgb(var(--color-text-muted) / <alpha-value>)',
          400: 'rgb(var(--color-text-muted) / <alpha-value>)',
          500: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
        cyber: {
          900: 'rgb(var(--color-cyber-900) / <alpha-value>)',
          800: 'rgb(var(--color-cyber-800) / <alpha-value>)',
          700: 'rgb(var(--color-cyber-700) / <alpha-value>)',
          neon: 'rgb(var(--color-cyber-neon) / <alpha-value>)',
          cyan: 'rgb(var(--color-cyber-cyan) / <alpha-value>)',
          purple: 'rgb(var(--color-cyber-purple) / <alpha-value>)',
          red: 'rgb(var(--color-cyber-red) / <alpha-value>)',
          warning: 'rgb(var(--color-cyber-warning) / <alpha-value>)'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff88' },
          '100%': { boxShadow: '0 0 20px #00ff88, 0 0 30px #00ff88' },
        }
      }
    },
  },
  plugins: [],
}
