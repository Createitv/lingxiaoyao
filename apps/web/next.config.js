/** @type {import('next').NextConfig} */
const isDesktop = process.env.BUILD_TARGET === 'desktop';
const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  // Desktop mode: static export for Tauri; server mode: standalone for Docker
  output: isDesktop ? 'export' : 'standalone',
  images: {
    // Work around Next 15 dev-time remote image matcher instability.
    // Keep optimization enabled in production web builds.
    unoptimized: isDesktop || isDev,
    remotePatterns: isDesktop
      ? []
      : [
          // Tencent COS (image CDN)
          {
            protocol: 'https',
            hostname: '*.myqcloud.com',
            pathname: '/**',
          },
          // Tencent VOD thumbnails
          {
            protocol: 'https',
            hostname: '*.vod2.myqcloud.com',
            pathname: '/**',
          },
          // WeChat avatars
          {
            protocol: 'https',
            hostname: 'thirdwx.qlogo.cn',
            pathname: '/**',
          },
        ],
  },
  // Allow importing from workspace packages
  transpilePackages: ['@workspace/ui', '@workspace/types'],
  // Pre-existing lint issues in mdx components — lint separately via `pnpm lint`
  eslint: { ignoreDuringBuilds: true },
  // Security and caching headers (not supported with output: 'export')
  ...(isDesktop
    ? {}
    : {
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'DENY' },
                { key: 'X-XSS-Protection', value: '1; mode=block' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
              ],
            },
            {
              source: '/(.*)\\.(js|css|woff2?|png|jpg|jpeg|gif|svg|ico|webp)',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
          ];
        },
      }),
};

module.exports = nextConfig;
