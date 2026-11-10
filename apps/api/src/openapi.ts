import type { INestApplication } from "@nestjs/common";
import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { z } from "zod";
import "./schemas.ts"; // регистрирует схемы в z.globalRegistry

const ref = (schema: z.ZodType) => {
  const id = z.globalRegistry.get(schema)?.id;
  if (!id) throw new Error("zod-схеме нужен .meta({ id })");
  return { $ref: `#/components/schemas/${id}` };
};

/** 200 с телом по zod-схеме (array: true — массив). */
export const ApiOk = (schema: z.ZodType, opts: { array?: boolean } = {}) =>
  ApiOkResponse({ schema: opts.array ? { type: "array", items: ref(schema) } : ref(schema) });

const errorBody = { $ref: "#/components/schemas/ErrorBody" };

export const ApiNotFound = (description: string) =>
  applyDecorators(ApiNotFoundResponse({ description, schema: errorBody }));

export const ApiBadRequest = (description: string) =>
  applyDecorators(ApiBadRequestResponse({ description, schema: errorBody }));

export function buildOpenApi(app: INestApplication) {
  const config = new DocumentBuilder().setTitle("VSEE API").setVersion("0.1.0").build();
  // operationId = имя метода контроллера → orval-хуки вида useListVenues
  const doc = SwaggerModule.createDocument(app, config, { operationIdFactory: (_c, method) => method });

  const { schemas } = z.toJSONSchema(z.globalRegistry, {
    target: "openapi-3.0",
    uri: (id) => `#/components/schemas/${id}`,
  });
  for (const s of Object.values(schemas)) delete s.$id; // $id не валиден в OpenAPI 3.0
  doc.components = { ...doc.components, schemas: { ...doc.components?.schemas, ...(schemas as object) } };
  return doc;
}
