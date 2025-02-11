/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        display: ['Cabinet Grotesk','ui-sans-serif','system-ui','sans-serif','Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji']
      },
      fontSize: {
        'h7': ['12px', { lineHeight: '14.4px' }],
      },
      fontWeight: {
        'semi-bold': 600,
      },
      aspectRatio: {
        '3': '3',
        '4': '4',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#BDEB00",
        secondary: {
          // 100: "#FF5956",
          100: '#EFEFEF',
          900: "#FF5956",
        },
        customBlue: '#074678',
        customGreen: '#00aca5',
        customLightGreen: '#00c8b6',
        customBackgroundGreen: '#eafafa',
        customGray: '#808080',
        customLightGray: '#A0A0A0',
        customBackgroundGray: '#F6F6F6',
        customHeaderGray: '#FBFBFC',
        customYellow: '#EF9B39',
        customLightBlue: '#00aca5'
      },
      maxWidth: {
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
};
