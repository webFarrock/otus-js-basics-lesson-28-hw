module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    node: true,
    es2021: true,
    "jest/globals": true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  root: true,
  plugins: ["jest", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-var-requires": "off",
  },
};
