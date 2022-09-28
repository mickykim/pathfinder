/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        visited: {
          "0%": { clipPath: "circle(15%)", backgroundColor: "rgb(133 77 14)" },
          "100%": {
            clipPath: "circle(75%)",
            backgroundColor: "rgb(234 179 8)",
          },
        },
        circle: {
          "0%": { clipPath: "circle(15%)" },
          "100%": {
            clipPath: "circle(75%)",
          },
        },
        melt: {
          "0%": {
            clipPath:
              "path('M0 -0.12C8.33 -8.46 16.67 -12.62 25 -12.62C37.5 -12.62 35.91 0.15 50 -0.12C64.09 -0.4 62.5 -34.5 75 -34.5C87.5 -34.5 87.17 -4.45 100 -0.12C112.83 4.2 112.71 -17.95 125 -18.28C137.29 -18.62 137.76 1.54 150.48 -0.12C163.19 -1.79 162.16 -25.12 174.54 -25.12C182.79 -25.12 191.28 -16.79 200 -0.12L200 -34.37L0 -34.37L0 -0.12Z')",
          },
          "100%": {
            clipPath:
              "path('M0 199.88C8.33 270.71 16.67 306.13 25 306.13C37.5 306.13 35.91 231.4 50 231.13C64.09 230.85 62.5 284.25 75 284.25C87.5 284.25 87.17 208.05 100 212.38C112.83 216.7 112.71 300.8 125 300.47C137.29 300.13 137.76 239.04 150.48 237.38C163.19 235.71 162.16 293.63 174.54 293.63C182.79 293.63 191.28 262.38 200 199.88L200 0.13L0 0.13L0 199.88Z')",
          },
        },
      },
      animation: {
        circle: "circle 1s ease-in-out ",
        visited: "visited 1s ease-in-out ",
        melt: "melt 1s ease-in-out forwards",
        "pulse-slow": "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
