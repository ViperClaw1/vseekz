// Чистое преобразование fixtures (вложенный формат) → плоские строки таблиц Prisma.
// Без БД, чтобы проверять в unit-тестах.
import restaurants from "@vsee/shared/fixtures/restaurants.json" with { type: "json" };
import salons from "@vsee/shared/fixtures/salons.json" with { type: "json" };

const venueFields = ({ menu, serviceCategories, masters, ...venue }) => venue;

export function buildSeedData(rs = restaurants, ss = salons) {
  const data = {
    venues: [],
    menuCategories: [],
    products: [],
    modifiers: [],
    serviceCategories: [],
    services: [],
    masters: [],
  };

  for (const r of rs) {
    data.venues.push({ ...venueFields(r), type: "RESTAURANT" });
    r.menu.forEach((cat, ci) => {
      data.menuCategories.push({ id: cat.id, venueId: r.id, name: cat.name, sort: ci });
      cat.products.forEach(({ modifiers = [], ...p }, pi) => {
        data.products.push({ ...p, venueId: r.id, categoryId: cat.id, sort: pi });
        for (const m of modifiers) data.modifiers.push({ ...m, productId: p.id });
      });
    });
  }

  for (const s of ss) {
    data.venues.push({ ...venueFields(s), type: "SALON" });
    s.serviceCategories.forEach((cat, ci) => {
      data.serviceCategories.push({ id: cat.id, venueId: s.id, name: cat.name, sort: ci });
      cat.services.forEach((svc, si) => {
        data.services.push({ ...svc, venueId: s.id, categoryId: cat.id, sort: si });
      });
    });
    for (const m of s.masters) data.masters.push({ ...m, venueId: s.id });
  }

  validate(data);
  return data;
}

function validate(d) {
  const errors = [];
  const unique = (rows, key, label) => {
    const seen = new Set();
    for (const r of rows) {
      if (seen.has(r[key])) errors.push(`${label}: дубль ${key}=${r[key]}`);
      seen.add(r[key]);
    }
  };

  unique(d.venues, "slug", "venue");
  for (const t of ["venues", "menuCategories", "products", "serviceCategories", "services", "masters"]) {
    unique(d[t], "id", t);
  }

  for (const p of d.products) {
    if (!Number.isInteger(p.price) || p.price <= 0) errors.push(`product ${p.id}: цена ${p.price}`);
  }
  for (const m of d.modifiers) {
    if (!Number.isInteger(m.price) || m.price < 0) errors.push(`modifier ${m.name} (${m.productId}): цена ${m.price}`);
  }
  for (const s of d.services) {
    if (!Number.isInteger(s.price) || s.price <= 0) errors.push(`service ${s.id}: цена ${s.price}`);
    if (!Number.isInteger(s.durationMin) || s.durationMin <= 0) errors.push(`service ${s.id}: длительность ${s.durationMin}`);
  }

  // Мастер может оказывать только услуги своего салона.
  const serviceVenue = new Map(d.services.map((s) => [s.id, s.venueId]));
  for (const m of d.masters) {
    for (const id of m.services) {
      if (serviceVenue.get(id) !== m.venueId) errors.push(`master ${m.id}: услуга ${id} не из его салона`);
    }
  }

  for (const v of d.venues) {
    if (!/^\d{2}:\d{2}$/.test(v.opensAt) || !/^\d{2}:\d{2}$/.test(v.closesAt)) errors.push(`venue ${v.id}: часы работы`);
    if (!/^\+996 \d{3} \d{3} \d{3}$/.test(v.phone)) errors.push(`venue ${v.id}: телефон ${v.phone}`);
  }

  if (errors.length) throw new Error(`Fixtures невалидны:\n- ${errors.join("\n- ")}`);
}
