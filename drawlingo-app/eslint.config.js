import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  // Archivos ignorados
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "*.config.js", "vite.config.ts"],
  },

  // Reglas base de JS
  js.configs.recommended,

  // Reglas de Vue 3 (incluye vue-eslint-parser para archivos .vue)
  ...pluginVue.configs["flat/recommended"],

  // Reglas de TypeScript
  ...tseslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // Desactiva reglas que conflictúan con Prettier
  prettierConfig,

  // Re-aplica vue-eslint-parser para archivos .vue (debe ir DESPUÉS de tseslint)
  // y configura el parser de TS para los bloques <script>
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
  },

  // Configuración para archivos TS puros
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Reglas comunes para TS y Vue
  {
    files: ["**/*.{ts,vue}"],
    plugins: {
      prettier,
    },
    rules: {
      // Prettier como regla de ESLint
      "prettier/prettier": "error",

      // TypeScript
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/no-non-null-assertion": "off",

      // Vue
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/define-macros-order": ["error", { order: ["defineProps", "defineEmits"] }],
      "vue/block-lang": ["error", { script: { lang: "ts" } }],
      "vue/attribute-hyphenation": ["error", "never"],

      // General
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
    },
  },

  // Archivos de configuración (vite.config, vitest.config, etc.)
  {
    files: ["*.config.{js,ts}", "*.config.*.{js,ts}"],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Tests (reglas más permisivas)
  {
    files: ["**/__tests__/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "no-console": "off",
    },
  },
];
