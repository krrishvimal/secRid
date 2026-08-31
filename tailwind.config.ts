import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sanctuary: {
          dark: "#090A0F",
          card: "#12151E",
          cardBorder: "#1E2330",
          cardHover: "#181D2A",
          accent: "#7C65C1",
          accentGlow: "rgba(124, 101, 193, 0.15)",
          rose: "#E06D8A",
          sage: "#79B4A9",
          amber: "#DCA766",
          textMuted: "#8E94A5",
          textFaint: "#545A6D",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "card-glow": "cardGlow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        cardGlow: {
          "0%": { boxShadow: "0 0 15px rgba(124, 101, 193, 0.05)" },
          "100%": { boxShadow: "0 0 25px rgba(124, 101, 193, 0.18)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
