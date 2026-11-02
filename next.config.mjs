import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  cacheComponents: true,
  experimental: {
    inlineCss: true,
    turbopackFileSystemCacheForBuild: true,
    optimizePackageImports: ['framer-motion', 'lucide-react', 'date-fns', 'lodash'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.shorakaei.ir' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400,
  },
};

export default withBundleAnalyzer(nextConfig);