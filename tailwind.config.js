/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nearBlack: '#1F1F1F',
        gold: '#D2A86B',
        offWhite: '#F6F5F3',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        serif: ['IM Fell English', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
