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
        sans: ['"Plus Jakarta Sans"', '"Hind Siliguri"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', 'serif'],
      },
      colors: {
        // Extracted from Swade Allade Cafeteria logo & hero artwork
        garden: {
          50: '#f2fbf4',
          100: '#dff6e4',
          200: '#bfeccb',
          300: '#8ddba4',
          400: '#53c276',
          500: '#2ba554',
          600: '#16803c', // Primary banner green
          700: '#0f6530',
          800: '#0a4a23', // Deep emerald leaf green
          900: '#062c15', // Night cottage green
          950: '#041a0d', // Deepest night garden backdrop
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047', // Bright golden text from logo
          400: '#facc15', // Luminous fairy-light gold
          500: '#eab308', // Warm bamboo gold
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        crimson: {
          500: '#ef4444',
          600: '#dc2626', // Tandoor / Continental red ribbon
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Keep legacy aliases mapped cleanly to the new palette
        espresso: {
          800: '#0a4a23',
          900: '#062c15',
          950: '#041a0d',
        },
        cafe: {
          50: '#fcfaf2',
          100: '#f7f3e3',
          200: '#ede4c7',
          300: '#decba0',
          400: '#ceb174',
          500: '#ca8a04',
          600: '#a16207',
          700: '#0f6530',
          800: '#0a4a23',
          900: '#062c15',
          950: '#041a0d',
        }
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(4, 26, 13, 0.18)',
        'gold-glow': '0 0 35px -5px rgba(250, 204, 21, 0.35)',
        'emerald-glow': '0 0 35px -5px rgba(22, 128, 60, 0.35)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(250, 204, 21, 0.15)',
      }
    },
  },
  plugins: [],
};
