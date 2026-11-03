/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', 'serif'],
      },
      colors: {
        gold: {
          50: '#fbf9f0',
          100: '#f6f1de',
          200: '#ede0bc',
          300: '#e1cb93',
          400: '#d5b36a',
          500: '#c59b27',
          600: '#b08320',
          700: '#8c631a',
          800: '#734f1b',
          900: '#61421b',
        },
        espresso: {
          800: '#2b1b13',
          900: '#1e130c',
          950: '#140c07',
        },
        cafe: {
          50: '#fdfbf7',
          100: '#f7f4ed',
          200: '#ede6d6',
          300: '#decfae',
          400: '#ceb484',
          500: '#b89659',
          600: '#9e7943',
          700: '#7c5c34',
          800: '#5e4529',
          900: '#43311f',
          950: '#261b11',
        }
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(20, 12, 7, 0.15)',
        'gold-glow': '0 0 35px -5px rgba(212, 175, 55, 0.25)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
};
