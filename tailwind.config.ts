import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bbasecolor: "#D9D9D9",
      },
    },
  },
  plugins: [],
} satisfies Config;
