// Mutator для orval: все сгенерированные запросы идут через него.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** Ошибка не-2xx ответа. body — тело ответа (ErrorBody из OpenAPI). */
export class ApiError<B = unknown> extends Error {
  constructor(
    readonly status: number,
    readonly body: B,
  ) {
    super(`API ${status}`);
  }
}

// orval подставляет ErrorType<...> как TError в сгенерированных хуках.
export type ErrorType<B> = ApiError<B>;

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE_URL + url, init);
  const body = res.status === 204 ? undefined : await res.json().catch(() => undefined);
  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}
