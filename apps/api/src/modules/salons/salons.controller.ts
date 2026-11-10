import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.ts";

@Controller("venues/:id")
export class SalonsController {
  constructor(private readonly prisma: PrismaService) {}

  // GET /venues/:id/services → категории услуг с услугами
  @Get("services")
  async services(@Param("id") id: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id, type: "SALON" },
      select: {
        serviceCategories: {
          orderBy: { sort: "asc" },
          select: {
            id: true,
            name: true,
            services: { orderBy: { sort: "asc" }, omit: { venueId: true, sort: true } },
          },
        },
      },
    });
    if (!venue) throw new NotFoundException("Салон не найден");
    return venue.serviceCategories;
  }

  // GET /venues/:id/masters?serviceIds=a,b → мастера, которые делают ВСЕ выбранные услуги
  @Get("masters")
  async masters(@Param("id") id: string, @Query("serviceIds") serviceIds?: string) {
    const ids = serviceIds?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

    const venue = await this.prisma.venue.findUnique({ where: { id, type: "SALON" }, select: { id: true } });
    if (!venue) throw new NotFoundException("Салон не найден");

    const masters = await this.prisma.master.findMany({
      where: { venueId: id, AND: ids.map((sid) => ({ services: { some: { id: sid } } })) },
      orderBy: [{ rating: "desc" }, { name: "asc" }],
      omit: { venueId: true },
      include: { services: { select: { id: true } } },
    });
    return masters.map(({ services, ...m }) => ({ ...m, serviceIds: services.map((s) => s.id) }));
  }
}
