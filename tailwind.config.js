const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: ['z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50'],
  theme: {
    extend: {
      content: {
        search: 'url(/images/svgs/search.svg)',
      },
      maxHeight: {
        'screen-95': '90vh',
      },
      // look here to add more colors later https://www.figma.com/file/8WjVJW9fa2rwGctm7ZVaCT/Design-System?node-id=1023%3A36350
      colors: {
        transparent: 'transparent',
        gray: {
          25: '#FEFEFE',
          50: '#F4F4F4',
          100: '#E0E0E0',
          200: '#C6C6C6',
          300: '#A8A8A8',
          400: '#8D8D8D',
          500: '#6F6F6F',
          600: '#525252',
          700: '#393939',
          800: '#262626',
          900: '#171717',
        },
        sharable: {
          nftCard: '#F1C1AA',
          divider: '#EAB196',
        },
        'hola-black': '#262626',
      },
      backgroundImage: {
        'colorful-gradient': "url('/images/gradients/gradient-3.png')",
      },
      fontFamily: {
        sans: ['Inter ', ...defaultTheme.fontFamily.sans],
        mono: ['Space_Mono', ...defaultTheme.fontFamily.mono],
      },
      keyframes: {
        loadingbar: {
          '0%': { left: 0, width: 0, opacity: 0.5 },
          '50%': { left: 0, width: '100%' },
          '100%': { left: '100%', width: 0 },
        },
        waving: {
          '0%': { transform: 'rotate(0.0deg)' },
          '15%': { transform: 'rotate(14.0deg)' },
          '30%': { transform: 'rotate(-8.0deg)' },
          '40%': { transform: 'rotate(14.0deg)' },
          '50%': { transform: 'rotate(-4.0deg)' },
          '60%': { transform: 'rotate(10.0deg)' },
          '70%': { transform: 'rotate(0.0deg)' },
          '100%': { transform: 'rotate(0.0deg)' },
        },
      },
      animation: {
        loading: 'loadingbar ease-in-out 4s infinite',
        waving: 'waving ease-in 1.5s infinite',
      },
    },
  },
  extend: {},
  variants: {
    scrollbar: ['rounded'],
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('@tailwindcss/forms'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        /* Hide scrollbar for Chrome, Safari and Opera */
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        /* Hide scrollbar for IE, Edge and Firefox */
        '.no-scrollbar': {
          '-ms-overflow-style': 'none' /* IE and Edge */,
          'scrollbar-width': 'none' /* Firefox */,
        },
      });
    }),
  ],
};
