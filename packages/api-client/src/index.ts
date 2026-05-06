import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import type {
  AfterSale,
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
  PickupPoint,
  PointsLedger,
  Product,
  ProductReview,
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

export class ApiClientError extends Error implements Partial<ApiErrorResponse> {
  code?: string;
  statusCode?: number;
  details?: unknown;
  timestamp?: string;
  path?: string;

  constructor(message: string, init?: Partial<ApiErrorResponse>) {
    super(message);
    this.name = "ApiClientError";
    Object.assign(this, init);
  }
}

export interface ApiClientOptions {
  baseUrl: string;
  getToken?: () => string | undefined | Promise<string | undefined>;
  request?: AxiosInstance;
}

type ProductListQuery = PageQuery & {
  categoryId?: string;
  keyword?: string;
  sortBy?: "comprehensive" | "sales" | "price_asc" | "price_desc" | "newest";
  enabled?: string;
};

type AdminProductUpsertInput = {
  categoryId: string;
  name: string;
  subtitle?: string;
  imageUrl: string;
  description?: string;
  enabled?: boolean;
  skus?: Array<{
    id?: string;
    name: string;
    unit: string;
    price: number;
    marketPrice?: number;
    stock: number;
    enabled?: boolean;
  }>;
};

type AdminPickupPointUpsertInput = {
  communityId: string;
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
  pickupTimeRange: string;
  enabled?: boolean;
};

type StatusPageQuery = PageQuery & {
  status?: string;
};

function normalizeMessage(message: string | string[] | undefined, fallback: string) {
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message.length > 0) return message;
  return fallback;
}

function toApiClientError(error: unknown) {
  if (error instanceof ApiClientError) return error;

  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as Partial<ApiErrorResponse> | undefined;

    if (responseData && typeof responseData === "object" && "success" in responseData) {
      return new ApiClientError(
        normalizeMessage(responseData.message, error.message),
        {
          code: responseData.code,
          statusCode: responseData.statusCode ?? error.response?.status,
          details: responseData.details,
          timestamp: responseData.timestamp,
          path: responseData.path,
        },
      );
    }

    return new ApiClientError(error.message, {
      statusCode: error.response?.status,
      details: error.response?.data,
    });
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message);
  }

  return new ApiClientError("Request failed");
}

function createHttpClient(options: ApiClientOptions) {
  if (options.request) return options.request;

  const httpClient = axios.create({
    baseURL: options.baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  httpClient.interceptors.request.use(async (config) => {
    const token = await options.getToken?.();

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.delete("Authorization");
    }

    return config;
  });

  return httpClient;
}

export function createApiClient(options: ApiClientOptions) {
  const request = createHttpClient(options);
  const apiPrefix = "/api/v1";

  async function send<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await request.request<ApiSuccessResponse<T> | ApiErrorResponse>({
        url: `${apiPrefix}${path}`,
        ...config,
      });

      const payload = response.data;

      if (!payload.success) {
        throw new ApiClientError(normalizeMessage(payload.message, "Request failed"), payload);
      }

      return payload.data;
    } catch (error) {
      throw toApiClientError(error);
    }
  }

  return {
    health: () => send<{ status: string }>("/health"),
    adminLogin: (body: { username: string; password: string }) =>
      send<{ accessToken: string }>("/auth/admin/login", { method: "POST", data: body }),
    wechatLogin: (body: { code: string; nickname?: string; avatarUrl?: string }) =>
      send<{ accessToken: string }>("/auth/wechat/login", { method: "POST", data: body }),
    getCategoryTree: () =>
      send<Array<Category & { children: Category[] }>>("/categories/tree"),
    getCategoryPage: (params?: PageQuery & { keyword?: string; enabled?: string }) =>
      send<PageResult<Category>>("/admin/categories", { params }),
    createCategory: (body: Omit<Category, "id">) =>
      send<Category>("/admin/categories", { method: "POST", data: body }),
    updateCategory: (id: string, body: Partial<Omit<Category, "id">>) =>
      send<Category>(`/admin/categories/${id}`, { method: "PATCH", data: body }),
    deleteCategory: (id: string) =>
      send<Category>(`/admin/categories/${id}`, { method: "DELETE" }),
    getCommunities: () => send<Community[]>("/communities"),
    getCommunityPage: (params?: PageQuery & { keyword?: string; enabled?: string }) =>
      send<PageResult<Community>>("/admin/communities", { params }),
    createCommunity: (body: Omit<Community, "id">) =>
      send<Community>("/admin/communities", { method: "POST", data: body }),
    updateCommunity: (id: string, body: Partial<Omit<Community, "id">>) =>
      send<Community>(`/admin/communities/${id}`, { method: "PATCH", data: body }),
    deleteCommunity: (id: string) =>
      send<Community>(`/admin/communities/${id}`, { method: "DELETE" }),
    getPickupPointPage: (params?: PageQuery & { communityId?: string; keyword?: string; enabled?: string }) =>
      send<PageResult<PickupPoint>>("/admin/pickup-points", { params }),
    createPickupPoint: (body: AdminPickupPointUpsertInput) =>
      send<PickupPoint>("/admin/pickup-points", { method: "POST", data: body }),
    updatePickupPoint: (id: string, body: Partial<AdminPickupPointUpsertInput>) =>
      send<PickupPoint>(`/admin/pickup-points/${id}`, { method: "PATCH", data: body }),
    deletePickupPoint: (id: string) =>
      send<PickupPoint>(`/admin/pickup-points/${id}`, { method: "DELETE" }),
    getAdminProducts: (params?: ProductListQuery) =>
      send<PageResult<Product>>("/admin/products", { params }),
    getProducts: (params?: ProductListQuery) =>
      send<PageResult<Product>>("/products", { params }),
    createProduct: (body: AdminProductUpsertInput) =>
      send<Product>("/admin/products", { method: "POST", data: body }),
    updateProduct: (id: string, body: Partial<AdminProductUpsertInput>) =>
      send<Product>(`/admin/products/${id}`, { method: "PATCH", data: body }),
    deleteProduct: (id: string) =>
      send<Product>(`/admin/products/${id}`, { method: "DELETE" }),
    getCart: () => send<unknown[]>("/cart"),
    getCartSummary: () => send<unknown>("/cart/summary"),
    upsertCartItem: (body: { skuId: string; quantity: number }) =>
      send("/cart/items", { method: "PUT", data: body }),
    updateCartItemSelected: (skuId: string, body: { selected: boolean }) =>
      send(`/cart/items/${skuId}/selected`, { method: "PATCH", data: body }),
    updateAllCartSelected: (body: { selected: boolean }) =>
      send("/cart/items/selected-all", { method: "PATCH", data: body }),
    createOrder: (body: {
      communityId: string;
      pickupPointId: string;
      couponId?: string;
      items: Array<{ skuId: string; quantity: number }>;
    }) => send<Order>("/orders", { method: "POST", data: body }),
    getMyOrders: (params?: StatusPageQuery) =>
      send<PageResult<Order>>("/orders/mine", { params }),
    getMyOrderSummary: () => send<OrderSummary>("/orders/mine/summary"),
    reorder: (orderId: string) => send(`/orders/${orderId}/reorder`, { method: "POST" }),
    createWechatPayment: (orderId: string) =>
      send<{ paymentNo: string; payParams: Record<string, string> }>(
        `/payments/wechat/orders/${orderId}`,
        { method: "POST" },
      ),
    getOrderPayments: (orderId: string) =>
      send<Payment[]>(`/payments/orders/${orderId}`),
    getMiniappHome: (params?: { communityId?: string }) =>
      send<MiniappHomeData>("/miniapp/home", { params }),
    getMiniappCategoryPage: (params?: { categoryId?: string }) =>
      send<MiniappCategoryPageData>("/miniapp/category-page", { params }),
    getMiniappMine: () => send<unknown>("/miniapp/mine"),
    getMyCoupons: (params?: StatusPageQuery) =>
      send<PageResult<unknown>>("/coupons/mine", { params }),
    claimCoupon: (templateId: string) =>
      send(`/coupons/templates/${templateId}/claim`, { method: "POST" }),
    getMyFavorites: (params?: PageQuery) =>
      send<PageResult<unknown>>("/users/me/favorites", { params }),
    favoriteProduct: (productId: string) =>
      send(`/users/me/favorites/${productId}`, { method: "POST" }),
    unfavoriteProduct: (productId: string) =>
      send(`/users/me/favorites/${productId}`, { method: "DELETE" }),
    getBrowsingHistory: (params?: PageQuery) =>
      send<PageResult<unknown>>("/users/me/browsing-history", { params }),
    recordBrowsingHistory: (productId: string) =>
      send(`/users/me/browsing-history/${productId}`, { method: "POST" }),
    getAddresses: () => send<unknown[]>("/users/me/addresses"),
    upsertAddress: (body: {
      id?: string;
      contactName: string;
      contactPhone: string;
      province?: string;
      city?: string;
      district?: string;
      detailAddress: string;
      isDefault?: boolean;
    }) => send("/users/me/addresses", { method: "POST", data: body }),
    createAfterSale: (body: {
      orderId: string;
      type: "REFUND_ONLY" | "RETURN_REFUND";
      reason: string;
      description?: string;
      items: Array<{ orderItemId: string; quantity: number }>;
    }) => send<AfterSale>("/after-sales", { method: "POST", data: body }),
    getMyAfterSales: (params?: PageQuery) =>
      send<PageResult<AfterSale>>("/after-sales/mine", { params }),
    getAfterSale: (id: string) => send<AfterSale>(`/after-sales/${id}`),
    createReview: (body: {
      orderItemId: string;
      rating: number;
      content?: string;
      imageUrls?: string[];
      anonymous?: boolean;
    }) => send<ProductReview>("/reviews", { method: "POST", data: body }),
    getProductReviews: (productId: string, params?: PageQuery) =>
      send<PageResult<ProductReview>>(`/reviews/products/${productId}`, { params }),
    getMyReviews: (params?: PageQuery) =>
      send<PageResult<ProductReview>>("/reviews/mine", { params }),
    getNotifications: (params?: PageQuery) =>
      send<PageResult<Notification>>("/notifications/mine", { params }),
    getUnreadNotificationCount: () =>
      send<number>("/notifications/unread-count"),
    markNotificationRead: (id: string) =>
      send(`/notifications/${id}/read`, { method: "POST" }),
    markAllNotificationsRead: () =>
      send("/notifications/read-all", { method: "POST" }),
    getPointsLedger: (params?: PageQuery) =>
      send<PageResult<PointsLedger>>("/points/mine", { params }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
export type { AxiosInstance, AxiosRequestConfig, AxiosError };
