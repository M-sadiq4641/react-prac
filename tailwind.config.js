/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        xxl: "1400px",
      },
      backgroundImage: {
        bodyBG: "url('/images/bg.png')",
        heroBG: "url('/images/heroBG.png')",
        navBG: "url('/images/navbarBG.png')",
        ftBG: "url('/images/fundamentalsBG.png')",
        ftShape: "url('/images/ftShape.png')",
        tokenomicsBG: "url('/images/tokenomicmanimg.png')",
      },
      colors: {
        secondary: "#6F767E",
      },
      fontFamily: {
        bungee: ["var(--font-bungee)"],
      },
    },
  },
  plugins: [],
};
