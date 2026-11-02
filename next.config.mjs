import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForBuild: true,
    optimizePackageImports: ['framer-motion', 'lucide-react', 'date-fns', 'lodash'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.shorakaei.ir' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400,
  },
};

export default withBundleAnalyzer(nextConfig);