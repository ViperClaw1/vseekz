import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.ts";
import { buildOpenApi } from "./openapi.ts";

try {
  process.loadEnvFile();
} catch {}

const app = await NestFactory.create(AppModule);
app.enableCors({ origin: (process.env.WEB_ORIGIN ?? "http://localhost:3000").split(",") });
app.enableShutdownHooks();
SwaggerModule.setup("docs", app, buildOpenApi(app)); // UI: /docs, JSON: /docs-json
await app.listen(process.env.PORT ?? 4000);
