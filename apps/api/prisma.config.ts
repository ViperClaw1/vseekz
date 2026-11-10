import { defineConfig } from "prisma/config";

// Локально берём .env, в CI переменные приходят из окружения.
try {
  process.loadEnvFile();
} catch {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.mjs",
  },
  // Не env(): он падает без переменной, а `prisma generate` (postinstall, CI) URL не нужен.
  datasource: { url: process.env.DATABASE_URL ?? "" },
});
