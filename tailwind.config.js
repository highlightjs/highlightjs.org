/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./news/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '0.75rem',
        md: '2rem',
      },
    },
    extend: {
      boxShadow: {
        '3xl': '7px 7px 15px 0 #000',
      },
      colors: {
        'brand-grey': '#2f3130',
        'brand-red': '#512222',
        'brand-red-alt': '#6c2c2d',
      }
    },
  },
  plugins: [],
}

