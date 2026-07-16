/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#355E3B",
        "accent-orange": "#D27D56",
        "accent-moss": "#8A9A5B",
        "on-surface": "#2D2926",
        "background": "#FFFFFF",
        "surface": "#FFFFFF",
        "surface-container-low": "#F9F9F7",
        "outline-variant": "#E8E8E3",
        "on-surface-variant": "#595450",
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "8px",
        "xl": "12px",
        "full": "9999px"
      },
      spacing: {
        "gutter": "12px",
        "lg": "20px",
        "xs": "4px",
        "xl": "28px",
        "md": "12px",
        "sm": "6px",
        "base": "4px",
        "container-margin": "20px"
      },
      fontFamily: {
        "serif": ["Newsreader", "serif"],
        "sans": ["Inter", "sans-serif"],
        "display-sm": ["Newsreader"],
        "headline-lg": ["Newsreader"],
        "headline-md": ["Newsreader"],
        "headline-lg-mobile": ["Newsreader"],
      },
    },
  },
  plugins: [],
}
