import { fileURLToPath } from "node:url";
import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(fileURLToPath(new URL(".", import.meta.url))),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["tests/e2e/**", "node_modules/**"],
    // Default isolate: true spins up a fresh worker per file; large imports (e.g. members)
    // + jsdom can exceed Vitest's 60s worker start timeout. Share one worker instead.
    isolate: false,
    maxWorkers: 1,
    pool: "threads",
    fileParallelism: false,
  },
});
