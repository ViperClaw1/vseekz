// E2E по собранному API (dist/) против засиженной БД. Нужны: pnpm build, DATABASE_URL, prisma db seed.
import "reflect-metadata";
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../dist/app.module.js";
import { z } from "zod";
import { buildSeedData } from "../prisma/seed-data.mjs";
import * as S from "../dist/schemas.js";

const seed = buildSeedData();
let app;
let base;

before(async () => {
  app = await NestFactory.create(AppModule, { logger: false });
  await app.listen(0, "127.0.0.1");
  base = `http://127.0.0.1:${app.getHttpServer().address().port}`;
});
after(() => app?.close());

// schema — контракт из OpenAPI: ответ 200 обязан ему соответствовать (strictObject — без лишних полей).
async function get(path, schema) {
  const res = await fetch(base + path);
  const body = await res.json();
  if (schema && res.status === 200) schema.parse(body);
  return { status: res.status, body };
}
const list = (s) => z.array(s);

test("GET /venues — все заведения, без тяжёлых полей", async () => {
  const { status, body } = await get("/venues", list(S.VenueListItem));
  assert.equal(status, 200);
  assert.equal(body.length, seed.venues.length);
  assert.ok(body.every((v) => !("description" in v) && !("gallery" in v)));
  const ratings = body.map((v) => v.rating);
  assert.deepEqual(ratings, [...ratings].sort((a, b) => b - a), "сортировка по рейтингу");
});

test("GET /venues?type= фильтрует, невалидный type → 400", async () => {
  const salons = await get("/venues?type=SALON", list(S.VenueListItem));
  assert.equal(salons.body.length, seed.venues.filter((v) => v.type === "SALON").length);
  assert.ok(salons.body.every((v) => v.type === "SALON"));
  assert.equal((await get("/venues?type=BAR")).status, 400);
});

test("GET /venues?q= ищет по названию без учёта регистра", async () => {
  const { body } = await get("/venues?q=PIZ");
  assert.deepEqual(body.map((v) => v.slug), ["pizza-forno"]);
});

test("GET /venues/:slug — детали или 404", async () => {
  const ok = await get("/venues/burger-lab", S.Venue);
  assert.equal(ok.status, 200);
  assert.equal(ok.body.name, "Burger Lab");
  assert.ok(ok.body.description);
  assert.equal((await get("/venues/nope")).status, 404);
});

test("GET /venues/:id/menu — категории по порядку, блюда с модификаторами", async () => {
  const { status, body } = await get("/venues/r-burger-lab/menu", list(S.MenuCategory));
  assert.equal(status, 200);
  const expected = seed.menuCategories.filter((c) => c.venueId === "r-burger-lab").map((c) => c.name);
  assert.deepEqual(body.map((c) => c.name), expected);
  const chef = body[0].products.find((p) => p.id === "r-burger-chef");
  assert.equal(chef.price, 345);
  assert.ok(chef.modifiers.some((m) => m.name === "Сыр" && m.price === 70));
});

test("GET /venues/:id/menu для салона → 404", async () => {
  assert.equal((await get("/venues/s-beauty-room/menu")).status, 404);
});

test("GET /products/:id/related — до 4 других блюд того же ресторана", async () => {
  const { status, body } = await get("/products/r-burger-chef/related", list(S.Product));
  assert.equal(status, 200);
  assert.ok(body.length > 0 && body.length <= 4);
  assert.ok(body.every((p) => p.id !== "r-burger-chef" && p.id.startsWith("r-burger-")));
  assert.equal((await get("/products/nope/related")).status, 404);
});

test("GET /venues/:id/services — категории с услугами; для ресторана 404", async () => {
  const { status, body } = await get("/venues/s-beauty-room/services", list(S.ServiceCategory));
  assert.equal(status, 200);
  assert.deepEqual(body.map((c) => c.name), ["Маникюр", "Педикюр", "Брови и ресницы"]);
  assert.ok(body[0].services.some((s) => s.price === 1600 && s.durationMin === 120));
  assert.equal((await get("/venues/r-burger-lab/services")).status, 404);
});

test("GET /venues/:id/masters — все мастера салона по рейтингу", async () => {
  const { body } = await get("/venues/s-beauty-room/masters", list(S.Master));
  assert.deepEqual(body.map((m) => m.name), ["Елена", "Мария", "Айжан"]);
  assert.ok(body.every((m) => Array.isArray(m.serviceIds) && !("services" in m)));
});

test("GET /venues/:id/masters?serviceIds= — только мастера, делающие все услуги", async () => {
  const names = async (q) => (await get(`/venues/s-beauty-room/masters?serviceIds=${q}`, list(S.Master))).body.map((m) => m.name);
  assert.deepEqual(await names("s-br-manicure-gel,s-br-pedicure-gel"), ["Мария"]);
  assert.deepEqual(await names("s-br-lashes-lami"), ["Елена"]);
  assert.deepEqual(await names("s-br-lashes-lami,s-br-manicure-gel"), []);
  assert.equal((await get("/venues/r-burger-lab/masters")).status, 404);
});
