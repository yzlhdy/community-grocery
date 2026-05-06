import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind className，保持 shadcn/ui 组件样式可覆盖。
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
