import { Controller, Get, NotFoundException, Param, ParseEnumPipe, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { VenueType } from "../../generated/prisma/client.ts";
import { ApiBadRequest, ApiNotFound, ApiOk } from "../../openapi.ts";
import { PrismaService } from "../../prisma/prisma.service.ts";
import { Venue, VenueListItem } from "../../schemas.ts";

@ApiTags("venues")
@Controller("venues")
export class VenuesController {
  constructor(private readonly prisma: PrismaService) {}

  // ponytail: без пагинации и pg_trgm — заведений единицы; курсор и trgm-индекс, когда их станут сотни.
  @Get()
  @ApiQuery({ name: "type", required: false, enum: VenueType, enumName: "VenueType" })
  @ApiQuery({ name: "q", required: false, description: "Поиск по названию" })
  @ApiQuery({ name: "city", required: false, example: "Bishkek" })
  @ApiOk(VenueListItem, { array: true })
  @ApiBadRequest("Неизвестный type")
  listVenues(
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
      omit: { description: true, gallery: true, createdAt: true, updatedAt: true },
      orderBy: [{ rating: "desc" }, { name: "asc" }],
    });
  }

  @Get(":slug")
  @ApiOk(Venue)
  @ApiNotFound("Заведение не найдено")
  async getVenue(@Param("slug") slug: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { slug },
      omit: { createdAt: true, updatedAt: true },
    });
    if (!venue) throw new NotFoundException("Заведение не найдено");
    return venue;
  }
}
