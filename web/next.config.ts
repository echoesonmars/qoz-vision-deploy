import type { NextConfig } from "next";

const videoUploadMb = Number.parseInt(process.env.VIDEO_MAX_UPLOAD_MB ?? "500", 10);
const videoUploadBodyLimit =
  Number.isFinite(videoUploadMb) && videoUploadMb > 0 ? videoUploadMb * 1024 * 1024 : 500 * 1024 * 1024;

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  serverExternalPackages: ["exceljs", "pdf-lib", "@pdf-lib/fontkit"],
  outputFileTracingIncludes: {
    "/api/exports/generate": ["./lib/exports/fonts/**/*"],
  },
  experimental: {
    middlewareClientMaxBodySize: videoUploadBodyLimit,
    serverActions: {
      bodySizeLimit: videoUploadBodyLimit,
    },
  },
};

export default nextConfig;
