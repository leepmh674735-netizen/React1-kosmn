/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tossBlue: {
          DEFAULT: '#3182f6',
          light: '#f2f8ff',
          dark: '#1b64da',
          hover: '#1b64da',
        },
        tossGray: {
          DEFAULT: '#f3f4f6',
          light: '#f9fafb',
          dark: '#8b95a1',
          text: '#4e5968',
          title: '#191f28',
          border: '#e5e8eb',
        },
        upRed: {
          DEFAULT: '#f04452',
          light: '#feebee',
        },
        downBlue: {
          DEFAULT: '#3182f6',
          light: '#e8f3ff',
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'toss': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'toss-hover': '0 12px 40px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
