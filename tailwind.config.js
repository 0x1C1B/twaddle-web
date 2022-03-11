const scrollbarPlugin = require("tailwind-scrollbar");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  variants: {
    extends: {
      scrollbar: ["dark"],
    },
  },
  plugins: [scrollbarPlugin],
};
