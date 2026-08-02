/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/site/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default tailwindConfig;
