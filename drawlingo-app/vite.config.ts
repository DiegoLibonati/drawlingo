import path from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

import type { UserConfig } from "vite";

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const isDev = mode === "development";

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
        "@tests": path.resolve(import.meta.dirname, "./__tests__"),
      },
    },
    server: {
      port: 3000,
      open: false,
      host: "0.0.0.0",
      strictPort: true,
      watch: {
        usePolling: true,
      },
    },
    preview: {
      port: 3001,
    },
    build: {
      outDir: "dist",
      sourcemap: isDev,
      minify: "esbuild",
      target: "ES2022",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["vue"],
          },
        },
      },
    },
  };
});
