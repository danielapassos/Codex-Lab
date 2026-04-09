import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // Ignores must come first so generated/backup Next output is never linted.
  globalIgnores([
    ".next/**",
    "**/.next/**",
    ".next.bak*/**",
    "**/.next.bak*/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  ...nextVitals,
  ...nextTs,
]);

export default eslintConfig;
