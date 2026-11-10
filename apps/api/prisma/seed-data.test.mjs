import { test } from "node:test";
import assert from "node:assert/strict";
import restaurants from "@vsee/shared/fixtures/restaurants.json" with { type: "json" };
import salons from "@vsee/shared/fixtures/salons.json" with { type: "json" };
import { buildSeedData } from "./seed-data.mjs";

const clone = (x) => structuredClone(x);

test("реальные fixtures валидны и раскладываются по таблицам", () => {
  const d = buildSeedData();

  assert.equal(d.venues.length, restaurants.length + salons.length);
  assert.ok(d.venues.every((v) => !("menu" in v) && !("masters" in v)), "вложенные поля не попали в Venue");

  const productIds = new Set(d.products.map((p) => p.id));
  assert.ok(d.modifiers.every((m) => productIds.has(m.productId)), "модификатор ссылается на блюдо");

  const menuCatIds = new Set(d.menuCategories.map((c) => c.id));
  assert.ok(d.products.every((p) => menuCatIds.has(p.categoryId)), "блюдо ссылается на категорию");

  const types = Object.fromEntries(d.venues.map((v) => [v.id, v.type]));
  assert.ok(d.products.every((p) => types[p.venueId] === "RESTAURANT"));
  assert.ok(d.services.every((s) => types[s.venueId] === "SALON"));
  assert.ok(d.masters.every((m) => m.services.length > 0), "у мастера есть услуги");
});

test("sort идёт по порядку в fixtures", () => {
  const d = buildSeedData();
  const first = restaurants[0];
  const cats = d.menuCategories.filter((c) => c.venueId === first.id);
  assert.deepEqual(cats.map((c) => c.sort), cats.map((_, i) => i));
});

const broken = [
  ["дубль slug", (rs) => { rs[1].slug = rs[0].slug; }, /дубль slug/],
  ["дубль id блюда", (rs) => { rs[0].menu[0].products[1].id = rs[0].menu[0].products[0].id; }, /products: дубль id/],
  ["нулевая цена блюда", (rs) => { rs[0].menu[0].products[0].price = 0; }, /цена 0/],
  ["дробная цена модификатора", (rs) => { rs[1].menu[0].products[0].modifiers[0].price = 10.5; }, /modifier/],
  ["часы работы", (rs) => { rs[0].opensAt = "9:00"; }, /часы работы/],
  ["телефон не +996", (rs) => { rs[0].phone = "+7 701 000 00 00"; }, /телефон/],
];

for (const [name, mutate, error] of broken) {
  test(`ловит ошибку: ${name}`, () => {
    const rs = clone(restaurants);
    mutate(rs);
    assert.throws(() => buildSeedData(rs, salons), error);
  });
}

test("ловит мастера с услугой чужого салона", () => {
  const ss = clone(salons);
  ss[0].masters[0].services.push(ss[1].serviceCategories[0].services[0].id);
  assert.throws(() => buildSeedData(restaurants, ss), /не из его салона/);
});

test("ловит неположительную длительность услуги", () => {
  const ss = clone(salons);
  ss[0].serviceCategories[0].services[0].durationMin = 0;
  assert.throws(() => buildSeedData(restaurants, ss), /длительность/);
});
