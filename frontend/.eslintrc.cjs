module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  // in main config for TSX/JSX source files
  plugins: [],
  rules: {
    "@typescript-eslint/no-empty-object-type": ["warn", { allowWithName: "Props$" }],
  },
}
