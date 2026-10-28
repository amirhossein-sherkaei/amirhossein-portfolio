# Infinity Speed Boost
$ErrorActionPreference = "Stop"
Set-Location "C:\Users\AmirHossien\Desktop\amirhossein-portfolio"

Write-Host "Starting Speed Boost..." -ForegroundColor Cyan

# 1. Add preconnect to layout.tsx
$layoutPath = "src\app\layout.tsx"
$layoutContent = Get-Content -LiteralPath $layoutPath -Raw

if ($layoutContent -notmatch 'preconnect.*img.shorakaei') {
    $preconnect = "        <link rel=""preconnect"" href=""https://img.shorakaei.ir"" crossOrigin=""anonymous"" />" + [Environment]::NewLine
    $preconnect += "        <link rel=""dns-prefetch"" href=""https://img.shorakaei.ir"" />" + [Environment]::NewLine
    $preconnect += "        <link rel=""preconnect"" href=""https://shorakaei-comments.vercel.app"" crossOrigin=""anonymous"" />" + [Environment]::NewLine
    $preconnect += "        <link rel=""dns-prefetch"" href=""https://shorakaei-comments.vercel.app"" />" + [Environment]::NewLine
    $preconnect += "        <link rel=""preconnect"" href=""https://va.vercel-scripts.com"" crossOrigin=""anonymous"" />" + [Environment]::NewLine
    $preconnect += "        <link rel=""dns-prefetch"" href=""https://va.vercel-scripts.com"" />" + [Environment]::NewLine
    
    $layoutContent = $layoutContent -replace '(<link rel="manifest" href="/manifest.json" />)', ("`$1" + [Environment]::NewLine + $preconnect)
    $layoutContent | Out-File -LiteralPath $layoutPath -Encoding UTF8 -Force
    Write-Host "  1. Preconnect added (6 domains)" -ForegroundColor Green
} else {
    Write-Host "  1. Preconnect already exists" -ForegroundColor Yellow
}

# 2. Add revalidate to homepage for ISR
$pagePath = "src\app\page.tsx"
$pageContent = Get-Content -LiteralPath $pagePath -Raw

if ($pageContent -notmatch 'export const revalidate') {
    $pageContent = "export const revalidate = 3600;" + [Environment]::NewLine + [Environment]::NewLine + $pageContent
    $pageContent | Out-File -LiteralPath $pagePath -Encoding UTF8 -Force
    Write-Host "  2. ISR caching added (revalidate = 3600)" -ForegroundColor Green
} else {
    Write-Host "  2. Revalidate already exists" -ForegroundColor Yellow
}

# 3. Add hero LCP CSS
$heroCss = @"
/* Hero LCP Priority */
.hero-section img[fetchpriority='high'],
.hero-editorial-band img,
.hero-inner > img {
  content-visibility: visible !important;
  contain: none !important;
}
"@
$heroCss | Out-File -LiteralPath "src\styles\infinity-hero-lcp.css" -Encoding UTF8 -Force

# Add CSS import
$layoutContent = Get-Content -LiteralPath $layoutPath -Raw
if ($layoutContent -notmatch 'infinity-hero-lcp.css') {
    $layoutContent = $layoutContent -replace 'import "@/styles/infinity-home-speed.css";', ('import "@/styles/infinity-home-speed.css";' + [Environment]::NewLine + 'import "@/styles/infinity-hero-lcp.css";')
    $layoutContent | Out-File -LiteralPath $layoutPath -Encoding UTF8 -Force
}
Write-Host "  3. Hero LCP CSS added" -ForegroundColor Green

# 4. Commit and Push
Write-Host "  Pushing to Vercel..." -ForegroundColor Cyan
git add .
git commit -m "perf(infinity): preconnect, ISR caching, hero LCP priority"
git push origin main

Write-Host ""
Write-Host "DONE! Wait 60s for Vercel to deploy." -ForegroundColor Green
