import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  async redirects() {
    return [{ source: "/", destination: "/dashboard", permanent: false }];
  },
};

export default nextConfig;
