import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#b92e53",
          neutral: "#121212",
          "base-100": "#121212",
          "base-content": "#ffffff",
          "neutral-0": "#ffffff",
          "neutral-100": "#f2f2f2",
          "neutral-200": "#e5e5e5",
          "neutral-300": "#d4d4d4",
          "neutral-400": "#a3a3a3",
          "neutral-500": "#737373",
          "neutral-600": "#525252",
          "neutral-700": "#404040",
          "neutral-800": "#262626",
          "neutral-900": "#171717",
          "neutral-1000": "#121212",
        },
        light: {
          primary: "#6200ea", // Rich purple for primary actions
          secondary: "#03a9f4", // Bright blue for secondary actions
          neutral: "#ffffff", // Clean white background
          "base-100": "#f5f7fa", // Soft cool white for base
          "base-content": "#2d3748", // Dark slate for text
          "neutral-0": "#ffffff", // Pure white for consistency
          "neutral-100": "#e3f2fd", // Light sky blue for subtle backgrounds
          "neutral-200": "#bbdefb", // Sky blue for cards
          "neutral-300": "#80cbc4", // Teal for section highlights
          "neutral-400": "#4caf50", // Fresh green for action buttons
          "neutral-500": "#388e3c", // Bold green for headings
          "neutral-600": "#0288d1", // Deep blue for text contrast
          "neutral-700": "#1565c0", // Royal blue for footer or navbar
          "neutral-800": "#0d47a1", // Midnight blue for deep contrast
          "neutral-900": "#ff7043", // Warm coral for highlights
          "neutral-1000": "#212121", // Deepest contrast where required
        },
      },
    ],
  },
};
