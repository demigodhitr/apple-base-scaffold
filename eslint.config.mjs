import frontend from "./frontend/eslint.config.mjs";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/build/**",
      "**/dist/**",
      "backend/**",
      "tests/**",
      "frontend/plugins/**",
      "frontend/src/components/ui/**",
    ],
  },
  ...frontend,
];
