/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tema warna: hitam, putih, biru tua
        primary: {
          900: '#0a1628', // biru tua sangat gelap
          800: '#0f2744', // biru tua
          700: '#1a3a5c', // biru tua medium
          600: '#1e4d7b', // biru tua
        },
        dark: {
          900: '#000000',
          800: '#0a0a0a',
          700: '#121212',
          600: '#1a1a1a',
          500: '#262626',
        },
        accent: {
          DEFAULT: '#1e4d7b',
          light: '#2d6494',
          dark: '#0f2744',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};