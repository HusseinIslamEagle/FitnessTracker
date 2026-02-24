import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import promise from "eslint-plugin-promise";
import jsxA11y from "eslint-plugin-jsx-a11y";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  globalIgnores([
    "dist",
    "node_modules",
    "coverage",
    "test-results",
    "playwright-report",
  ]),

  // ✅ Node/config files (vite/eslint/vitest/playwright) — allow __dirname, process, etc.
  {
    files: [
      "*.config.{js,mjs,cjs}",
      "eslint.config.js",
      "vite.config.{js,mjs,cjs}",
      "vitest.config.{js,mjs,cjs}",
      "playwright.config.{js,mjs,cjs}",
      "playwright.local.config.{js,mjs,cjs}",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // ما نضيّعش وقتنا في ترتيب imports لملفات config
      "import/order": "off",
      // ومش محتاجين resolver هنا
      "import/no-unresolved": "off",
      // لو eslint لقط console في configs
      "no-console": "off",
    },
  },

  // ✅ App code
  {
    files: ["src/**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      importPlugin.flatConfigs.recommended,
      promise.configs["flat/recommended"],
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },

      // ✅ مهم: resolver للـ aliases بتوع Vite
      "import/resolver": {
        alias: {
          map: [
             ["@", "./src"],
             ["@app", "./src/app"],
             ["@features", "./src/features"],
             ["@shared", "./src/shared"], 
             ["@data", "./src/data"],
             ["@domain", "./src/domain"],
          ],
          extensions: [".js", ".jsx", ".json", ".png", ".jpg", ".jpeg", ".svg"],
        },
        node: true,
      },
    },
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      // تنظيف imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Imports
      "import/no-unresolved": [
        "error",
        {
          ignore: ["\\.png$", "\\.jpg$", "\\.jpeg$", "\\.svg$"],
        },
      ],
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // Promises
      // لو حابب تشغّلها بعدين OK، لكن دلوقتي خليها off زي ما عملت
      "promise/param-names": "off",

      // React Refresh rule ساعات بيزعّق في Context files (هنعالجها ببلوك مخصوص تحت)
      "react-refresh/only-export-components": "warn",
    },
  },

  // ✅ Context files (غالبًا بتكسر react-refresh/only-export-components)
  {
    files: ["src/**/context/**/*.{js,jsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // ✅ Tests & e2e
  {
    files: ["**/*.{test,spec}.{js,jsx}", "e2e/**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "import/no-unresolved": "off",
      "no-unused-expressions": "off",
    },
  },
]);