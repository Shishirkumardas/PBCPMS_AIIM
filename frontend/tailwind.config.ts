import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto)", "system-ui", "sans-serif"],
        bengali: ["var(--font-bengali)", "var(--font-noto)", "system-ui", "sans-serif"],
      },
      colors: {
        bd: {
          green: "#006A4E",
          "green-dark": "#004D38",
          "green-deep": "#003628",
          "green-light": "#E6F4EF",
          "green-mid": "#2E8B6A",
          red: "#F42A41",
          gold: "#C4A35A",
          cream: "#F7FBF9",
          slate: "#1E293B",
        },
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 106, 78, 0.08)",
        soft: "0 2px 12px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
