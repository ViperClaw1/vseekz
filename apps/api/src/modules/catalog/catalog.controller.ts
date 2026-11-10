import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiNotFound, ApiOk } from "../../openapi.ts";
import { PrismaService } from "../../prisma/prisma.service.ts";
import { MenuCategory, Product } from "../../schemas.ts";

@ApiTags("catalog")
@Controller()
export class CatalogController {
  constructor(private readonly prisma: PrismaService) {}

  // GET /venues/:id/menu → категории с блюдами и модификаторами
  @Get("venues/:id/menu")
  @ApiOk(MenuCategory, { array: true })
  @ApiNotFound("Ресторан не найден")
  async getMenu(@Param("id") id: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id, type: "RESTAURANT" },
      select: {
        menuCategories: {
          orderBy: { sort: "asc" },
          select: {
            id: true,
            name: true,
            products: {
              orderBy: { sort: "asc" },
              omit: { venueId: true, sort: true },
              include: { modifiers: { select: { id: true, name: true, price: true } } },
            },
          },
        },
      },
    });
    if (!venue) throw new NotFoundException("Ресторан не найден");
    return venue.menuCategories;
  }

  // GET /products/:id/related → «Вам может понравиться»: другие доступные блюда того же ресторана
  @Get("products/:id/related")
  @ApiOk(Product, { array: true })
  @ApiNotFound("Блюдо не найдено")
  async getRelatedProducts(@Param("id") id: string) {
    const product = await this.prisma.product.findUnique({ where: { id }, select: { venueId: true } });
    if (!product) throw new NotFoundException("Блюдо не найдено");
    return this.prisma.product.findMany({
      where: { venueId: product.venueId, id: { not: id }, isAvailable: true },
      orderBy: [{ category: { sort: "asc" } }, { sort: "asc" }],
      take: 4,
      omit: { venueId: true, sort: true },
    });
  }
}
