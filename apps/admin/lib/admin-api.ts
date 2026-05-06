"use client"

import { createApiClient } from "@community-grocery/api-client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"
const TOKEN_KEY = "community_grocery_admin_token"

/**
 * 读取后台登录 Token。
 */
export function getAdminToken() {
  if (typeof window === "undefined") return undefined
  return window.localStorage.getItem(TOKEN_KEY) ?? undefined
}

/**
 * 保存后台登录 Token。
 */
export function setAdminToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 清除后台登录 Token。
 */
export function clearAdminToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

/**
 * 后台接口客户端，自动携带管理员 Token。
 */
export const adminApi = createApiClient({
  baseUrl: API_BASE_URL,
  getToken: getAdminToken,
})
