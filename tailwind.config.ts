import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#101417",
          800: "#243039",
          600: "#50606b"
        },
        exam: {
          50: "#f8fbff",
          100: "#dbe7f6",
          500: "#dc2626",
          700: "#1e3a8a"
        },
        verdict: {
          500: "#0f8b62",
          700: "#0a6448"
        },
        caution: {
          500: "#b7791f",
          700: "#8a5b13"
        }
      },
      boxShadow: {
        panel: "0 1px 2px rgba(16, 20, 23, 0.08)"
      }
    }
  },
  plugins: [forms]
};

export default config;
