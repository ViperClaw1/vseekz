import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service.ts";

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
