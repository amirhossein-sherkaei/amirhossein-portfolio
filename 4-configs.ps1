# 4-configs.ps1
# Removes .backup-* folders, updates .gitignore, rewrites next.config.mjs

$ErrorActionPreference = "Stop"

$projectRoot = (Get-Location).Path
Write-Host ""
Write-Host "=== CLEANUP + CONFIG FIX ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
    Write-Host "ERROR: package.json not found. Run from project root." -ForegroundColor Red
    exit 1
}

# --- 1) Remove .backup-* folders inside project ---
Write-Host "--- Step 1: Remove .backup-* folders ---" -ForegroundColor Magenta
$oldBackups = Get-ChildItem -Path $projectRoot -Filter ".backup-*" -Directory -ErrorAction SilentlyContinue
if ($oldBackups -and $oldBackups.Count -gt 0) {
    foreach ($b in $oldBackups) {
        Remove-Item -Path $b.FullName -Recurse -Force
        Write-Host "  REMOVED: $($b.Name)" -ForegroundColor Green
    }
} else {
    Write-Host "  SKIP: no .backup-* folders found" -ForegroundColor Yellow
}

# --- 2) Update .gitignore ---
Write-Host ""
Write-Host "--- Step 2: Update .gitignore ---" -ForegroundColor Magenta
$gitignorePath = Join-Path $projectRoot ".gitignore"
$enc = New-Object System.Text.UTF8Encoding($false)

if (Test-Path $gitignorePath) {
    $giContent = [System.IO.File]::ReadAllText($gitignorePath, [System.Text.Encoding]::UTF8)
    $nl = if ($giContent.Contains("`r`n")) { "`r`n" } else { "`n" }

    if ($giContent -match "(?m)^\.backup-\*/") {
        Write-Host "  SKIP: .backup-*/ already in .gitignore" -ForegroundColor Yellow
    } else {
        $giContent = $giContent.TrimEnd() + $nl + $nl + "# Backup folders" + $nl + ".backup-*/" + $nl + "*.backup" + $nl
        [System.IO.File]::WriteAllText($gitignorePath, $giContent, $enc)
        Write-Host "  OK: .backup-*/ added to .gitignore" -ForegroundColor Green
    }
} else {
    Write-Host "  WARN: .gitignore not found, creating..." -ForegroundColor Yellow
    $newGi = "node_modules/" + $nl + ".next/" + $nl + ".vercel/" + $nl + ".backup-*/" + $nl + "*.backup" + $nl + ".env*.local" + $nl
    [System.IO.File]::WriteAllText($gitignorePath, $newGi, $enc)
    Write-Host "  OK: .gitignore created" -ForegroundColor Green
}

# --- 3) Rewrite next.config.mjs ---
Write-Host ""
Write-Host "--- Step 3: Rewrite next.config.mjs ---" -ForegroundColor Magenta
$nextConfigPath = Join-Path $projectRoot "next.config.mjs"

if (Test-Path $nextConfigPath) {
    Copy-Item -Path $nextConfigPath -Destination "$nextConfigPath.bak" -Force
    Write-Host "  Backup: $nextConfigPath.bak" -ForegroundColor Gray
}

$nextConfigContent = @'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /* Performance */
  compress: true,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  /* Image optimization */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: false,
  },

  /* Modules & packages */
  experimental: {
    optimizePackageImports: ['shiki'],
  },

  /* HTTP Headers: Cache + Security */
  async headers() {
    return [
      /* 1) Immutable static assets */
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      /* 2) Optimized images - 30 days */
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },

      /* 3) Static public assets */
      {
        source:
          '/(.*)\\.(woff2|woff|ttf|otf|png|jpg|jpeg|gif|svg|webp|avif|ico|mp4|webm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      /* 4) HTML pages */
      {
        source: '/((?!api|_next|_vercel|.*\\..*).*)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=120, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },

      /* 5) Blog posts - longer cache */
      {
        source: '/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=300, s-maxage=604800, stale-while-revalidate=2592000',
          },
        ],
      },

      /* 6) Security headers */
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },

  /* 301 Redirects */
  async redirects() {
    return [
      /* 1) Specific: www -> canonical */
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.shorakaei.ir' }],
        destination: 'https://shorakaei.ir/:path*',
        permanent: true,
      },

      /* 2) Specific: old vercel project */
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'amirhossein-portfolio.vercel.app',
          },
        ],
        destination: 'https://shorakaei.ir/:path*',
        permanent: true,
      },

      /* 3) Wildcard: any other vercel.app */
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '.*\\.vercel\\.app',
          },
        ],
        destination: 'https://shorakaei.ir/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
'@

[System.IO.File]::WriteAllText($nextConfigPath, $nextConfigContent, $enc)
Write-Host "  OK: next.config.mjs rewritten" -ForegroundColor Green

# --- 4) Verify ---
Write-Host ""
Write-Host "--- Verification ---" -ForegroundColor Magenta

$verifyConfig = [System.IO.File]::ReadAllText($nextConfigPath, [System.Text.Encoding]::UTF8)
if ($verifyConfig.Contains("unoptimized")) {
    Write-Host "  FAIL: unoptimized still present in next.config.mjs" -ForegroundColor Red
} else {
    Write-Host "  OK: unoptimized removed" -ForegroundColor Green
}

if ($verifyConfig.Contains("image/avif")) {
    Write-Host "  OK: AVIF format enabled" -ForegroundColor Green
}

$giCheck = [System.IO.File]::ReadAllText($gitignorePath, [System.Text.Encoding]::UTF8)
if ($giCheck -match "(?m)^\.backup-\*/") {
    Write-Host "  OK: .backup-*/ in .gitignore" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== ALL DONE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Restore if needed:" -ForegroundColor Yellow
Write-Host "  Copy-Item -Path `"$nextConfigPath.bak`" -Destination `"$nextConfigPath`" -Force" -ForegroundColor White
Write-Host ""