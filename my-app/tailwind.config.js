// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // 👈 Scan React files
  ],
  theme: {
    extend: {
      screens: {
        xs: "350px", // 👈 Custom breakpoint for > 350px
      },
    },
  },
  plugins: [],
}
