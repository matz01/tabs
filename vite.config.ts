/// <reference types="vitest" />

import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [fileURLToPath(new URL("./src/styles", import.meta.url))],
      },
    },
  },
  test: {
    include: ["src/**/*.test.{js,ts,tsx}"],
    globals: true, //https://vitest.dev/guide/migration.html#globals-as-a-default
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
