import { Controller, Get, NotFoundException, Param, ParseEnumPipe, Query } from "@nestjs/common";
import { VenueType } from "../../generated/prisma/client.ts";
import { PrismaService } from "../../prisma/prisma.service.ts";

@Controller("venues")
export class VenuesController {
  constructor(private readonly prisma: PrismaService) {}

  // GET /venues?type=RESTAURANT&q=пицца&city=Bishkek
  // ponytail: без пагинации и pg_trgm — заведений единицы; курсор и trgm-индекс, когда их станут сотни.
  @Get()
  list(
    @Query("type", new ParseEnumPipe(VenueType, { optional: true })) type?: VenueType,
    @Query("q") q?: string,
    @Query("city") city?: string,
  ) {
    return this.prisma.venue.findMany({
      where: {
        type,
        city,
        ...(q?.trim() && { name: { contains: q.trim(), mode: "insensitive" as const } }),
      },
      omit: { description: true, gallery: true },
      orderBy: [{ rating: "desc" }, { name: "asc" }],
    });
  }

  // GET /venues/:slug
  @Get(":slug")
  async bySlug(@Param("slug") slug: string) {
    const venue = await this.prisma.venue.findUnique({ where: { slug } });
    if (!venue) throw new NotFoundException("Заведение не найдено");
    return venue;
  }
}
