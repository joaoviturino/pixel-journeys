import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        game: {
          grass: "hsl(var(--grass))",
          "grass-dark": "hsl(var(--grass-dark))",
          path: "hsl(var(--path))",
          "path-dark": "hsl(var(--path-dark))",
          water: "hsl(var(--water))",
          "water-light": "hsl(var(--water-light))",
          "tree-trunk": "hsl(var(--tree-trunk))",
          "tree-leaves": "hsl(var(--tree-leaves))",
          "tree-leaves-light": "hsl(var(--tree-leaves-light))",
          building: "hsl(var(--building))",
          "building-dark": "hsl(var(--building-dark))",
          roof: "hsl(var(--roof))",
          "player-skin": "hsl(var(--player-skin))",
          "player-hair": "hsl(var(--player-hair))",
          "player-shirt": "hsl(var(--player-shirt))",
          "player-pants": "hsl(var(--player-pants))",
          "tall-grass": "hsl(var(--tall-grass))",
          "tall-grass-tip": "hsl(var(--tall-grass-tip))",
          "flower-red": "hsl(var(--flower-red))",
          "flower-yellow": "hsl(var(--flower-yellow))",
          fence: "hsl(var(--fence))",
          shadow: "hsl(var(--shadow))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "water-shimmer": {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
        "grass-sway": {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        "player-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "water-shimmer": "water-shimmer 2s ease-in-out infinite",
        "grass-sway": "grass-sway 3s ease-in-out infinite",
        "player-bounce": "player-bounce 0.3s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
