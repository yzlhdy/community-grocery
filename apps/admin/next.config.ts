import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@community-grocery/admin-ui",
    "@community-grocery/api-client",
    "@community-grocery/constants",
    "@community-grocery/types",
    "@community-grocery/utils",
  ],
};

export default nextConfig;
