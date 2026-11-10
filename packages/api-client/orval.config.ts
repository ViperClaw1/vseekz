import { defineConfig } from "orval";

// openapi.json пишет `pnpm --filter @vsee/api openapi`; сгенерированное коммитится, CI сверяет дрейф.
export default defineConfig({
  vsee: {
    input: "./openapi.json",
    output: {
      target: "./src/generated/api.ts",
      schemas: "./src/generated/model",
      client: "react-query",
      httpClient: "fetch",
      mode: "single",
      clean: true,
      override: {
        mutator: { path: "./src/fetcher.ts", name: "apiFetch" },
        fetch: { includeHttpResponseReturnType: false },
        query: { version: 5 },
      },
    },
  },
});
