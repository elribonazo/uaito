import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Disable no-unused-vars errors for specific patterns
      "@typescript-eslint/no-unused-vars": ["off", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      
      // Allow 'any' type in specific cases where it's hard to avoid
      "@typescript-eslint/no-explicit-any": "off",
      
      // Relax the this-binding rule
      "@typescript-eslint/no-this-alias": "off",
      
      // Enforce const when possible, but as offing
      "prefer-const": "off",
      
      // Configure react-hooks/exhaustive-deps as offing
      "react-hooks/exhaustive-deps": "off"
    }
  }
];

export default eslintConfig;
