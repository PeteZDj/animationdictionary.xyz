/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: produces `out/` with one index.html per pre-rendered route.
  output: "export",
  // Required so IIS static serving can match `/verbs/run/` -> `out/verbs/run/index.html`.
  trailingSlash: true,
  // No Node runtime in production yet, so the image optimizer is disabled.
  images: { unoptimized: true },
  // ESLint runs separately, not during build.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
