/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
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
        customYellow: '#EF9B39',
        customLightBlue: '#00aca5'
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};
