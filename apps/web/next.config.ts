import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vsee/api-client"], // workspace-пакет отдаёт исходники TS
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
