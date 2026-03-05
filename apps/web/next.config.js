/** @type {import('next').NextConfig} */
const isDesktop = process.env.BUILD_TARGET === 'desktop';

const nextConfig = {
  // Desktop mode: static export for Tauri
  output: isDesktop ? 'export' : undefined,
  images: {
    unoptimized: isDesktop,
    remotePatterns: isDesktop
      ? []
      : [
          // Tencent COS (image CDN)
          {
            protocol: 'https',
            hostname: '*.myqcloud.com',
          },
          // Tencent VOD thumbnails
          {
            protocol: 'https',
            hostname: '*.vod2.myqcloud.com',
          },
          // WeChat avatars
          {
            protocol: 'https',
            hostname: 'thirdwx.qlogo.cn',
          },
        ],
  },
  // Allow importing from workspace packages
  transpilePackages: ['@workspace/ui', '@workspace/types'],
  // Pre-existing lint issues in mdx components — lint separately via `pnpm lint`
  eslint: { ignoreDuringBuilds: true },
  // Security and caching headers
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
};

module.exports = nextConfig;
