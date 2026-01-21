// @ts-check
/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  endOfLine: 'lf',
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  vueIndentScriptAndStyle: true,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './app/assets/css/main.css',
};

export default config;
