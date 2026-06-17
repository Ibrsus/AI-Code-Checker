/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Inter'", "sans-serif"],
      },
      colors: {
        bg: "#0d0d0f",
        surface: "#16161a",
        border: "#2a2a30",
        accent: "#7c6af7",
        "accent-dim": "#3d3580",
        muted: "#52525e",
        text: "#e8e8f0",
        "text-dim": "#9898a8",
      },
    },
  },
  plugins: [],
};
