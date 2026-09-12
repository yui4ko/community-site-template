import type { Config } from "tailwindcss";
import themeConfig from "./theme.json";

const c = themeConfig.colors;

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Edit the hex values in theme.json, then rebuild — these are
                // compiled in at build time, so a colour change needs a rebuild.
                'brand': c.primary,        // buttons, links, headings
                'brand-light': c.primary,  // hover states (set your own lighter tone)
                'brand-deep': c.primary,   // header bar / dark sections
                'accent': c.secondary,     // secondary actions, highlights
                'ink': c.dark,             // footer, dark surfaces
                'muted': '#6B7280',
                'highlight': '#FFF200',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
} satisfies Config;
