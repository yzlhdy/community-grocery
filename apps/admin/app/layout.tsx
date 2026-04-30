import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "社区买菜后台",
  description: "社区买菜运营管理后台",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
