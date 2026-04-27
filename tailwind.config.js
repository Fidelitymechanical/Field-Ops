module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nearBlack: '#1F1F1F',
        gold: '#FFD700',
        offWhite: '#FAFAFA',
      },
      fontFamily: {
        serif: ['IM Fell English', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.offWhite'),
            a: {
              color: theme('colors.gold'),
              '&:hover': {
                color: theme('colors.offWhite'),
              },
            },
            h1: {
              color: theme('colors.gold'),
            },
            // Add any additional styling here
          },
        },
      }),
    },
  },
  variants: {},
  plugins: [],
};