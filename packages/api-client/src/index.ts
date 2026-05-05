import type { Category, Community, Order, Payment, Product } from "@community-grocery/types";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  statusCode: number;
  message: string | string[];
  details?: unknown;
  timestamp: string;
  path: string;
}

export interface ApiClientOptions {
  baseUrl: string;
  getToken?: () => string | undefined | Promise<string | undefined>;
  request?: typeof fetch;
}

type ApiRequestInit = Omit<RequestInit, "body"> & {
  body?: BodyInit | object;
};

export function createApiClient(options: ApiClientOptions) {
  const request = options.request ?? fetch;
  const apiPrefix = "/api/v1";

  async function send<T>(path: string, init?: ApiRequestInit): Promise<T> {
    const token = await options.getToken?.();
    const body: BodyInit | null | undefined =
      init?.body && typeof init.body === "object" && !(init.body instanceof FormData)
        ? JSON.stringify(init.body)
        : (init?.body as BodyInit | null | undefined);
    const response = await request(`${options.baseUrl}${path}`, {
      ...init,
      body,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });

    const payload = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;

    if (!payload.success) {
      const error = new Error(
        Array.isArray(payload.message) ? payload.message.join(", ") : payload.message,
      );
      Object.assign(error, payload);
      throw error;
    }

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return payload.data;
  }

  return {
    health: () => send<{ status: string }>(`${apiPrefix}/health`),
    adminLogin: (body: { username: string; password: string }) =>
      send<{ accessToken: string }>(`${apiPrefix}/auth/admin/login`, { method: "POST", body }),
    wechatLogin: (body: { code: string; nickname?: string; avatarUrl?: string }) =>
      send<{ accessToken: string }>(`${apiPrefix}/auth/wechat/login`, { method: "POST", body }),
    getCategoryTree: () =>
      send<Array<Category & { children: Category[] }>>(`${apiPrefix}/categories/tree`),
    getCommunities: () => send<Community[]>(`${apiPrefix}/communities`),
    getProducts: (query?: { categoryId?: string; keyword?: string }) => {
      const params = new URLSearchParams();
      if (query?.categoryId) params.set("categoryId", query.categoryId);
      if (query?.keyword) params.set("keyword", query.keyword);
      return send<Product[]>(`${apiPrefix}/products${params.size ? `?${params}` : ""}`);
    },
    getCart: () => send<unknown[]>(`${apiPrefix}/cart`),
    upsertCartItem: (body: { skuId: string; quantity: number }) =>
      send(`${apiPrefix}/cart/items`, { method: "PUT", body }),
    createOrder: (body: {
      communityId: string;
      pickupPointId: string;
      items: Array<{ skuId: string; quantity: number }>;
    }) => send<Order>(`${apiPrefix}/orders`, { method: "POST", body }),
    getMyOrders: () => send<Order[]>(`${apiPrefix}/orders/mine`),
    createWechatPayment: (orderId: string) =>
      send<{ paymentNo: string; payParams: Record<string, string> }>(
        `${apiPrefix}/payments/wechat/orders/${orderId}`,
        { method: "POST" },
      ),
    getOrderPayments: (orderId: string) =>
      send<Payment[]>(`${apiPrefix}/payments/orders/${orderId}`),
  };
}
