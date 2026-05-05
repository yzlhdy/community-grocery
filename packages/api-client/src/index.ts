import type {
  Category,
  Community,
  MiniappCategoryPageData,
  MiniappHomeData,
  Notification,
  Order,
  OrderSummary,
  PageQuery,
  PageResult,
  Payment,
  PointsLedger,
  Product,
  ProductReview,
  AfterSale,
} from "@community-grocery/types";

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

type ProductListQuery = PageQuery & {
  categoryId?: string;
  keyword?: string;
  sortBy?: "comprehensive" | "sales" | "price_asc" | "price_desc" | "newest";
  enabled?: string;
};

type StatusPageQuery = PageQuery & {
  status?: string;
};

function appendQuery(path: string, query?: object) {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return `${path}${params.size ? `?${params}` : ""}`;
}

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
    getCategoryPage: (query?: PageQuery & { keyword?: string; enabled?: string }) =>
      send<PageResult<Category>>(appendQuery(`${apiPrefix}/categories`, query)),
    createCategory: (body: Omit<Category, "id">) =>
      send<Category>(`${apiPrefix}/categories`, { method: "POST", body }),
    updateCategory: (id: string, body: Partial<Omit<Category, "id">>) =>
      send<Category>(`${apiPrefix}/categories/${id}`, { method: "PATCH", body }),
    deleteCategory: (id: string) =>
      send<Category>(`${apiPrefix}/categories/${id}`, { method: "DELETE" }),
    getCommunities: () => send<Community[]>(`${apiPrefix}/communities`),
    getCommunityPage: (query?: PageQuery & { keyword?: string; enabled?: string }) =>
      send<PageResult<Community>>(appendQuery(`${apiPrefix}/communities/admin/page`, query)),
    createCommunity: (body: Omit<Community, "id">) =>
      send<Community>(`${apiPrefix}/communities`, { method: "POST", body }),
    updateCommunity: (id: string, body: Partial<Omit<Community, "id">>) =>
      send<Community>(`${apiPrefix}/communities/${id}`, { method: "PATCH", body }),
    deleteCommunity: (id: string) =>
      send<Community>(`${apiPrefix}/communities/${id}`, { method: "DELETE" }),
    getPickupPointPage: (query?: PageQuery & { communityId?: string; keyword?: string; enabled?: string }) =>
      send<PageResult<unknown>>(appendQuery(`${apiPrefix}/pickup-points/admin/page`, query)),
    createPickupPoint: (body: object) =>
      send<unknown>(`${apiPrefix}/pickup-points`, { method: "POST", body }),
    updatePickupPoint: (id: string, body: object) =>
      send<unknown>(`${apiPrefix}/pickup-points/${id}`, { method: "PATCH", body }),
    deletePickupPoint: (id: string) =>
      send<unknown>(`${apiPrefix}/pickup-points/${id}`, { method: "DELETE" }),
    getProducts: (query?: ProductListQuery) =>
      send<PageResult<Product>>(appendQuery(`${apiPrefix}/products`, query)),
    createProduct: (body: object) =>
      send<Product>(`${apiPrefix}/products`, { method: "POST", body }),
    updateProduct: (id: string, body: object) =>
      send<Product>(`${apiPrefix}/products/${id}`, { method: "PATCH", body }),
    deleteProduct: (id: string) =>
      send<Product>(`${apiPrefix}/products/${id}`, { method: "DELETE" }),
    getCart: () => send<unknown[]>(`${apiPrefix}/cart`),
    getCartSummary: () => send<unknown>(`${apiPrefix}/cart/summary`),
    upsertCartItem: (body: { skuId: string; quantity: number }) =>
      send(`${apiPrefix}/cart/items`, { method: "PUT", body }),
    updateCartItemSelected: (skuId: string, body: { selected: boolean }) =>
      send(`${apiPrefix}/cart/items/${skuId}/selected`, { method: "PATCH", body }),
    updateAllCartSelected: (body: { selected: boolean }) =>
      send(`${apiPrefix}/cart/items/selected-all`, { method: "PATCH", body }),
    createOrder: (body: {
      communityId: string;
      pickupPointId: string;
      couponId?: string;
      items: Array<{ skuId: string; quantity: number }>;
    }) => send<Order>(`${apiPrefix}/orders`, { method: "POST", body }),
    getMyOrders: (query?: StatusPageQuery) =>
      send<PageResult<Order>>(appendQuery(`${apiPrefix}/orders/mine`, query)),
    getMyOrderSummary: () => send<OrderSummary>(`${apiPrefix}/orders/mine/summary`),
    reorder: (orderId: string) => send(`${apiPrefix}/orders/${orderId}/reorder`, { method: "POST" }),
    createWechatPayment: (orderId: string) =>
      send<{ paymentNo: string; payParams: Record<string, string> }>(
        `${apiPrefix}/payments/wechat/orders/${orderId}`,
        { method: "POST" },
      ),
    getOrderPayments: (orderId: string) =>
      send<Payment[]>(`${apiPrefix}/payments/orders/${orderId}`),
    getMiniappHome: (query?: { communityId?: string }) => {
      const params = new URLSearchParams();
      if (query?.communityId) params.set("communityId", query.communityId);
      return send<MiniappHomeData>(`${apiPrefix}/miniapp/home${params.size ? `?${params}` : ""}`);
    },
    getMiniappCategoryPage: (query?: { categoryId?: string }) => {
      const params = new URLSearchParams();
      if (query?.categoryId) params.set("categoryId", query.categoryId);
      return send<MiniappCategoryPageData>(
        `${apiPrefix}/miniapp/category-page${params.size ? `?${params}` : ""}`,
      );
    },
    getMiniappMine: () => send<unknown>(`${apiPrefix}/miniapp/mine`),
    getMyCoupons: (query?: StatusPageQuery) =>
      send<PageResult<unknown>>(appendQuery(`${apiPrefix}/coupons/mine`, query)),
    claimCoupon: (templateId: string) =>
      send(`${apiPrefix}/coupons/templates/${templateId}/claim`, { method: "POST" }),
    getMyFavorites: (query?: PageQuery) =>
      send<PageResult<unknown>>(appendQuery(`${apiPrefix}/users/me/favorites`, query)),
    favoriteProduct: (productId: string) =>
      send(`${apiPrefix}/users/me/favorites/${productId}`, { method: "POST" }),
    unfavoriteProduct: (productId: string) =>
      send(`${apiPrefix}/users/me/favorites/${productId}`, { method: "DELETE" }),
    getBrowsingHistory: (query?: PageQuery) =>
      send<PageResult<unknown>>(appendQuery(`${apiPrefix}/users/me/browsing-history`, query)),
    recordBrowsingHistory: (productId: string) =>
      send(`${apiPrefix}/users/me/browsing-history/${productId}`, { method: "POST" }),
    getAddresses: () => send<unknown[]>(`${apiPrefix}/users/me/addresses`),
    upsertAddress: (body: {
      id?: string;
      contactName: string;
      contactPhone: string;
      province?: string;
      city?: string;
      district?: string;
      detailAddress: string;
      isDefault?: boolean;
    }) => send(`${apiPrefix}/users/me/addresses`, { method: "POST", body }),
    createAfterSale: (body: {
      orderId: string;
      type: "REFUND_ONLY" | "RETURN_REFUND";
      reason: string;
      description?: string;
      items: Array<{ orderItemId: string; quantity: number }>;
    }) => send<AfterSale>(`${apiPrefix}/after-sales`, { method: "POST", body }),
    getMyAfterSales: (query?: PageQuery) =>
      send<PageResult<AfterSale>>(appendQuery(`${apiPrefix}/after-sales/mine`, query)),
    getAfterSale: (id: string) => send<AfterSale>(`${apiPrefix}/after-sales/${id}`),
    createReview: (body: {
      orderItemId: string;
      rating: number;
      content?: string;
      imageUrls?: string[];
      anonymous?: boolean;
    }) => send<ProductReview>(`${apiPrefix}/reviews`, { method: "POST", body }),
    getProductReviews: (productId: string, query?: PageQuery) =>
      send<PageResult<ProductReview>>(
        appendQuery(`${apiPrefix}/reviews/products/${productId}`, query),
      ),
    getMyReviews: (query?: PageQuery) =>
      send<PageResult<ProductReview>>(appendQuery(`${apiPrefix}/reviews/mine`, query)),
    getNotifications: (query?: PageQuery) =>
      send<PageResult<Notification>>(appendQuery(`${apiPrefix}/notifications/mine`, query)),
    getUnreadNotificationCount: () =>
      send<number>(`${apiPrefix}/notifications/unread-count`),
    markNotificationRead: (id: string) =>
      send(`${apiPrefix}/notifications/${id}/read`, { method: "POST" }),
    markAllNotificationsRead: () =>
      send(`${apiPrefix}/notifications/read-all`, { method: "POST" }),
    getPointsLedger: (query?: PageQuery) =>
      send<PageResult<PointsLedger>>(appendQuery(`${apiPrefix}/points/mine`, query)),
  };
}
