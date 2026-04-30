import type { Product } from "@community-grocery/types";

export interface ApiClientOptions {
  baseUrl: string;
  getToken?: () => string | undefined | Promise<string | undefined>;
  request?: typeof fetch;
}

export function createApiClient(options: ApiClientOptions) {
  const request = options.request ?? fetch;

  async function send<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await options.getToken?.();
    const response = await request(`${options.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  return {
    getProducts: () => send<Product[]>("/products"),
    health: () => send<{ status: string }>("/health"),
  };
}
