import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: "#FAF7F2",
          surface: "#FFFFFF",
          subtle: "#FAF0EB",
          border: "#E8E2D9",
          ink: "#1A1D20",
          muted: "#656C75",
        },
        rose: {
          DEFAULT: "#E09885",
          hover: "#D48875",
          light: "#FAF0EB",
          dark: "#B86854",
        },
        charcoal: {
          DEFAULT: "#1A1D20",
          light: "#2D3136",
          muted: "#4A5056",
        },
        sage: {
          DEFAULT: "#7C8B7B",
          light: "#F2F5F2",
        },
        clay: {
          DEFAULT: "#E09885",
          hover: "#D48875",
          light: "#FAF0EB",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
