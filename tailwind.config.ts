import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { fontFamily: { display: ["var(--font-display)", "Arial Narrow", "sans-serif"] } } }, plugins: [] } satisfies Config;
