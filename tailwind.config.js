/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1a1a2e',
        'bg-secondary': '#16213e',
        'bg-tertiary': '#0f3460',
        'bg-card': '#1f2b47',
        'bg-hover': '#253553',
        'border-primary': '#2a3a5c',
        'border-secondary': '#3a4a6c',
        'border-accent': '#e94560',
        'text-primary': '#eaeaea',
        'text-secondary': '#a8b2d1',
        'text-muted': '#6b7ba3',
        'text-inverse': '#1a1a2e',
        'accent-primary': '#e94560',
        'accent-primary-hover': '#d63851',
        'accent-secondary': '#0f3460',
        'accent-success': '#4ecca3',
        'accent-warning': '#f0a500',
        'accent-danger': '#e94560',
        'accent-info': '#3282b8',
      },
    },
  },
  plugins: [],
};