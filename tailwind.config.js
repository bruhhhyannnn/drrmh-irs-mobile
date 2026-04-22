/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          25: '#fff5f5',
          50: '#ffe5e5',
          100: '#f5c6c6',
          200: '#e58e8e',
          300: '#d65a5a',
          400: '#c53030',
          500: '#a11d1d',
          600: '#7f1616',
          700: '#5f1010',
          800: '#470b0b',
          900: '#2f0707',
          950: '#1a0303',
        },
        gray: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#e4e7ec',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1d2939',
          900: '#101828',
          950: '#0c0a0a',
        },
        success: {
          50: '#ecfdf3',
          100: '#d1fadf',
          500: '#12b76a',
          600: '#039855',
        },
        error: {
          50: '#fef3f2',
          100: '#fee4e2',
          500: '#f04438',
          600: '#d92d20',
        },
        warning: {
          50: '#fffaeb',
          100: '#fef0c7',
          500: '#f79009',
          600: '#dc6803',
        },
      },
      fontFamily: {
        outfit: ['Outfit_400Regular', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
