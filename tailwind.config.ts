
import type { Config } from "tailwindcss";

/**
 * Socia HRM Design System — Tailwind Config
 * Tokens mirror the CSS variables defined in src/index.css :root / .dark
 */
export default {
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
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				// Socia HRM font stacks
				sans: ['"DM Sans"', "system-ui", "-apple-system", "sans-serif"],
				serif: ['"Space Grotesk"', "sans-serif"],
				display: ['"Space Grotesk"', '"DM Sans"', "sans-serif"],
				body: ['"DM Sans"', "system-ui", "sans-serif"],
				mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
			},
			maxWidth: {
				"8xl": "88rem",
				"9xl": "96rem",
			},
			colors: {
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)",
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
				// Socia HRM brand colors
				brand: {
					blue: "#0077CC",
					"blue-light": "#0099FF",
					"blue-dark": "#005F9E",
					orange: "#E89122",
					"orange-light": "#F5A623",
					"orange-dark": "#DB6E1C",
					success: "#10B981",
					warning: "#F59E0B",
					error: "#DC2626",
				},
				// Legacy portfolio accent colors (kept for compatibility)
				dark: "#0F0F14",
				light: "#F2F2F5",
				blue: {
					50: "#E6F4FB",
					100: "#CCEAF7",
					200: "#99D5EF",
					300: "#66BFE6",
					400: "#33AADE",
					500: "#0099FF",
					600: "#0077CC",
					700: "#005F9E",
					800: "#004871",
					900: "#003043",
					950: "#001823",
				},
				orange: {
					50: "#FDF4E8",
					100: "#FAE6CB",
					200: "#F5CE97",
					300: "#F0B563",
					400: "#EB9D2F",
					500: "#E89122",
					600: "#DB6E1C",
					700: "#A85215",
					800: "#753B0E",
					900: "#432207",
					950: "#211003",
				},
				glass: {
					light: "rgba(0, 119, 204, 0.06)",
					DEFAULT: "rgba(0, 119, 204, 0.1)",
					dark: "rgba(0, 119, 204, 0.16)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
				xl: "calc(var(--radius) + 2px)",
				"2xl": "calc(var(--radius) + 6px)",
			},
			boxShadow: {
				card: "var(--shadow-card)",
				elevated: "var(--shadow-elevated)",
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
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"float-delay": {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"float-slow": {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
				rotation: {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				"reverse-rotation": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(-360deg)" },
				},
				"pulse-slow": {
					"0%, 100%": { transform: "scale(1)", opacity: "0.2" },
					"50%": { transform: "scale(1.05)", opacity: "0.3" },
				},
				"reverse-pulse": {
					"0%, 100%": { transform: "scale(1)", opacity: "0.2" },
					"50%": { transform: "scale(0.95)", opacity: "0.3" },
				},
				"pulse-glow": {
					"0%, 100%": { opacity: "1", filter: "brightness(1)" },
					"50%": { opacity: "0.8", filter: "brightness(1.2)" },
				},
				"spin-slow": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				"reverse-spin": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(-360deg)" },
				},
				flip: {
					"0%": { transform: "rotateY(0deg)" },
					"100%": { transform: "rotateY(360deg)" },
				},
				pop: {
					"0%": { transform: "scale(0.95)", opacity: "0.8" },
					"50%": { transform: "scale(1.05)", opacity: "1" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
				shimmer: {
					"0%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "200% 0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.5s ease-out",
				float: "float 6s ease-in-out infinite",
				"float-delay": "float-delay 7s ease-in-out infinite 1s",
				"float-slow": "float-slow 8s ease-in-out infinite 2s",
				rotation: "rotation 20s linear infinite",
				"pulse-slow": "pulse-slow 8s ease-in-out infinite",
				"reverse-pulse": "reverse-pulse 9s ease-in-out infinite 2s",
				"pulse-glow": "pulse-glow 3s ease-in-out infinite",
				"spin-slow": "spin-slow 25s linear infinite",
				"reverse-spin": "reverse-spin 30s linear infinite",
				flip: "flip 2s ease-in-out",
				pop: "pop 0.5s ease-in-out",
				shimmer: "shimmer 3s ease-in-out infinite",
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-primary": "var(--gradient-primary)",
				"gradient-accent": "var(--gradient-accent)",
				"gradient-hero": "var(--gradient-hero)",
				"gradient-glass": "var(--gradient-glass)",
				"gradient-blue-orange":
					"linear-gradient(135deg, hsl(199, 100%, 50%) 0%, hsl(199, 100%, 40%) 50%, hsl(36, 100%, 57%) 100%)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
