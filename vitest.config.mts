import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    env: { TMDB_ACCESS_TOKEN: "jeton-de-test" },
  },
});
