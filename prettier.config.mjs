/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tabWidth: 4,
  useTabs: false,
  semi: true,
  singleQuote: false,
  printWidth: 120,
  trailingComma: "es5",
};

export default config;
