// Заливает fixtures из @vsee/shared в Postgres. Идемпотентно: удаляет все заведения
// (каскадом — меню, услуги, мастеров) и создаёт заново.
// Запуск: pnpm --filter @vsee/api db:seed  (или prisma migrate reset)
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { buildSeedData } from "./seed-data.mjs";

if (process.env.NODE_ENV === "production") {
  console.error("seed: отказ — NODE_ENV=production");
  process.exit(1);
}

const data = buildSeedData();
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

try {
  await prisma.$transaction(async (tx) => {
    await tx.venue.deleteMany();
    await tx.venue.createMany({ data: data.venues });
    await tx.menuCategory.createMany({ data: data.menuCategories });
    await tx.product.createMany({ data: data.products });
    await tx.modifier.createMany({ data: data.modifiers });
    await tx.serviceCategory.createMany({ data: data.serviceCategories });
    await tx.service.createMany({ data: data.services });
    for (const { services, ...master } of data.masters) {
      await tx.master.create({
        data: { ...master, services: { connect: services.map((id) => ({ id })) } },
      });
    }
    // Дефолтный maxWait 2с не хватает: первое подключение к Docker на Windows ~1.3с + загрузка WASM.
  }, { maxWait: 15_000, timeout: 60_000 });

  console.table(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.length])));
} finally {
  await prisma.$disconnect();
}
