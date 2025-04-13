/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "#42A5F5",
          dark: "#1E88E5",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        bjt: {
          primary: "#111184",
          primaryLight: "#1E1E9E",
          secondary: "#D4AF37",
          secondaryLight: "#F0D875",
          secondaryDark: "#B08C1A",
          background: "#F5F7FA",
          cardBg: "#1E1E9E",
          cardBgLight: "#2A2AAF",
          textPrimary: "#1F2937",
          textSecondary: "#6B7280",
          success: "#10B981",
          successLight: "#D1FAE5",
          error: "#F4A1A1",
          errorLight: "#FEE2E2",
          inactive: "#9CA3AF",
          highlight: "#3B82F6",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        bjt: "12px",
      },
      fontFamily: {
        sans: ["Inter", "Montserrat", "sans-serif"],
      },
      fontSize: {
        "bjt-title": "22px",
        "bjt-text": "16px",
        "bjt-secondary": "14px",
        "bjt-small": "14px",
      },
      minHeight: {
        "bjt-touch": "50px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "tap-effect": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        tap: "tap-effect 0.15s ease-in-out",
        "fade-in": "fade-in 0.3s ease-in-out",
      },
      boxShadow: {
        premium: "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
        "premium-hover": "0 6px 20px 0 rgba(0, 0, 0, 0.15)",
        "card-premium": "0 8px 20px 0 rgba(0, 0, 0, 0.12)",
        "button-premium": "0 4px 10px 0 rgba(26, 42, 68, 0.2)",
        "nav-premium": "0 -4px 10px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
