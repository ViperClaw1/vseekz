import { Module } from "@nestjs/common";
import { CatalogController } from "./modules/catalog/catalog.controller.ts";
import { SalonsController } from "./modules/salons/salons.controller.ts";
import { VenuesController } from "./modules/venues/venues.controller.ts";
import { PrismaService } from "./prisma/prisma.service.ts";

// ponytail: контроллеры ходят в Prisma напрямую, без сервисов и feature-модулей —
// запросы короткие. Выносить в *.service.ts, когда появится логика сверх одного запроса.
@Module({
  controllers: [VenuesController, CatalogController, SalonsController],
  providers: [PrismaService],
})
export class AppModule {}
