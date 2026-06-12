/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // add theme colors from index.css

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        webprimary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          dark: "var(--primary-dark)",
          border: "var(--border)",
          success: "var(--success)",
          warning: "var(--warning)",
          error: "var(--error)",
          bgcard: "var(--bg-card)",
          bgprimary: "var(--bg-primary)",
          bgsecondary: "var(--bg-secondary)",
          bgsidebar: "var(--bg-sidebar)",
          gradient: {
            primary: "var(--gradient-primary)",
            secondary: "var(--gradient-secondary)",
            dark: "var(--gradient-dark)",
          },
        },
      },
      boxShadow: {
        card: "0 0 14px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
}
