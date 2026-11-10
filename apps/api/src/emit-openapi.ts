// node dist/emit-openapi.js <out.json> — пишет OpenAPI без запуска сервера и без БД.
import "reflect-metadata";
import { writeFileSync } from "node:fs";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.ts";
import { buildOpenApi } from "./openapi.ts";

const out = process.argv[2];
if (!out) throw new Error("usage: node dist/emit-openapi.js <out.json>");

const app = await NestFactory.create(AppModule, { logger: false });
writeFileSync(out, JSON.stringify(buildOpenApi(app), null, 2) + "\n");
await app.close();
console.log(`OpenAPI → ${out}`);
