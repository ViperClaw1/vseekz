#!/usr/bin/env bash
# Сверяет количество строк в БД после seed с fixtures. Нужны DATABASE_URL и psql.
set -euo pipefail

expected=$(node --input-type=module -e '
  import { buildSeedData } from "./prisma/seed-data.mjs";
  const d = buildSeedData();
  const links = d.masters.reduce((n, m) => n + m.services.length, 0);
  console.log([d.venues, d.menuCategories, d.products, d.modifiers, d.serviceCategories, d.services, d.masters]
    .map((t) => t.length).concat(links).join(" "));
')

actual=$(psql "$DATABASE_URL" -tA -F ' ' -c '
  select (select count(*) from "Venue"), (select count(*) from "MenuCategory"),
         (select count(*) from "Product"), (select count(*) from "Modifier"),
         (select count(*) from "ServiceCategory"), (select count(*) from "Service"),
         (select count(*) from "Master"), (select count(*) from "_MasterToService")')

echo "venues menuCategories products modifiers serviceCategories services masters links"
echo "expected: $expected"
echo "actual:   $actual"
[ "$expected" = "$actual" ]
