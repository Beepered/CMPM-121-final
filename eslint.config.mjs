//Linter made with Generative AI

// Import necessary modules using ES module syntax
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslintParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";

// Use FlatCompat for backward compatibility with older ESLint configs (optional)
const compat = new FlatCompat({
  baseDirectory: import.meta.url, // Base directory for resolving paths
});

export default [
  // Base JavaScript configuration
  js.configs.recommended,

  // TypeScript-specific configuration
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: "latest", // Use the latest ECMAScript standard
        sourceType: "module", // Enable ESM
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      // Example rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "indent": ["error", 2],
    },
  },

  // Global settings for Phaser or other libraries
  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      globals: {
        window: true,
        document: true,
        console: true,
        Phaser: "readonly", // Phaser global variable
      },
    },
  },
];
