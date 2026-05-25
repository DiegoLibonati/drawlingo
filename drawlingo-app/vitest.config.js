import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./__tests__"),
    },
  },
  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost",
      },
    },
    root: ".",
    include: ["__tests__/**/*.{test,spec}.ts"],
    setupFiles: ["__tests__/vitest.setup.ts"],
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,vue}"],
      exclude: ["src/**/*.d.ts", "src/main.ts", "src/types/**/*.ts"],
      reportsDirectory: "coverage",
      reporter: ["text", "lcov", "html"],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
});
