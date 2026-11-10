// Контракт ответов API. Отсюда: components.schemas в OpenAPI → orval → типы/хуки в web,
// и строгая проверка реальных ответов в e2e. meta({ id }) = имя схемы в OpenAPI.
import { z } from "zod";

export const VenueType = z.enum(["RESTAURANT", "SALON"]).meta({ id: "VenueType" });

export const VenueListItem = z
  .strictObject({
    id: z.string(),
    slug: z.string(),
    type: VenueType,
    name: z.string(),
    city: z.string(),
    address: z.string(),
    lat: z.number(),
    lng: z.number(),
    phone: z.string(),
    instagram: z.string().nullable(),
    opensAt: z.string().meta({ example: "09:00" }),
    closesAt: z.string().meta({ example: "22:00" }),
    rating: z.number(),
    reviewsCount: z.int(),
    coverUrl: z.string().nullable(),
    promo: z.string().nullable().meta({ example: "-20% на всё меню с 12:00 до 16:00" }),
  })
  .meta({ id: "VenueListItem" });

export const Venue = VenueListItem.extend({
  description: z.string(),
  gallery: z.array(z.string()),
}).meta({ id: "Venue" });

export const Modifier = z
  .strictObject({ id: z.string(), name: z.string(), price: z.int().meta({ description: "сом" }) })
  .meta({ id: "Modifier" });

export const Product = z
  .strictObject({
    id: z.string(),
    categoryId: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.int().meta({ description: "сом" }),
    weight: z.string().nullable(),
    imageUrl: z.string().nullable(),
    isAvailable: z.boolean(),
  })
  .meta({ id: "Product" });

export const MenuProduct = Product.extend({ modifiers: z.array(Modifier) }).meta({ id: "MenuProduct" });

export const MenuCategory = z
  .strictObject({ id: z.string(), name: z.string(), products: z.array(MenuProduct) })
  .meta({ id: "MenuCategory" });

export const Service = z
  .strictObject({
    id: z.string(),
    categoryId: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.int().meta({ description: "сом" }),
    durationMin: z.int(),
  })
  .meta({ id: "Service" });

export const ServiceCategory = z
  .strictObject({ id: z.string(), name: z.string(), services: z.array(Service) })
  .meta({ id: "ServiceCategory" });

export const Master = z
  .strictObject({
    id: z.string(),
    name: z.string(),
    specialty: z.string(),
    avatarUrl: z.string().nullable(),
    rating: z.number(),
    serviceIds: z.array(z.string()),
  })
  .meta({ id: "Master" });

export const ErrorBody = z
  .object({ statusCode: z.int(), message: z.unknown(), error: z.string().optional() })
  .meta({ id: "ErrorBody" });
