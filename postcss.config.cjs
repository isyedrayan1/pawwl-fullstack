const path = require("path");

module.exports = {
  plugins: {
    tailwindcss: {
      config: path.resolve(__dirname, "./frontend/tailwind.config.ts"),
    },
    autoprefixer: {},
  },
};
