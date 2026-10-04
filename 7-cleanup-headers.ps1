# 7-cleanup-headers.ps1
# Removes redundant Cache-Control headers for /_next/static and /_next/image
# Next.js manages these internally

$ErrorActionPreference = "Stop"
$projectRoot = (Get-Location).Path
$nextConfigPath = Join-Path $projectRoot "next.config.mjs"

Write-Host ""
Write-Host "=== CLEANUP CACHE-CONTROL HEADERS ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $nextConfigPath)) {
    Write-Host "ERROR: next.config.mjs not found" -ForegroundColor Red
    exit 1
}

# Backup
$backupPath = "$nextConfigPath.bak3"
Copy-Item -Path $nextConfigPath -Destination $backupPath -Force
Write-Host "Backup: $backupPath" -ForegroundColor Gray

$enc = New-Object System.Text.UTF8Encoding($false)
$content = [System.IO.File]::ReadAllText($nextConfigPath, [System.Text.Encoding]::UTF8)

# Block 1: /_next/static
$block1 = @'
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

'@

# Block 2: /_next/image
$block2 = @'
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

'@

$originalLength = $content.Length
$content = $content.Replace($block1, "")
$content = $content.Replace($block2, "")

if ($content.Length -eq $originalLength) {
    Write-Host "SKIP: blocks not found (already removed?)" -ForegroundColor Yellow
} else {
    Write-Host "OK: removed 2 blocks" -ForegroundColor Green
}

# Renumber comments: /* 3) → /* 1), etc.
$content = $content.Replace('/* 3) Static public assets */', '/* 1) Static public assets */')
$content = $content.Replace('/* 4) HTML pages */', '/* 2) HTML pages */')
$content = $content.Replace('/* 5) Blog posts - longer cache */', '/* 3) Blog posts - longer cache */')
$content = $content.Replace('/* 6) Security headers */', '/* 4) Security headers */')

[System.IO.File]::WriteAllText($nextConfigPath, $content, $enc)
Write-Host "OK: next.config.mjs updated" -ForegroundColor Green

# Verify
$verify = [System.IO.File]::ReadAllText($nextConfigPath, [System.Text.Encoding]::UTF8)
if ($verify -match "_next/static/:path\*") {
    Write-Host "WARN: /_next/static block still present" -ForegroundColor Yellow
} else {
    Write-Host "OK: /_next/static block removed" -ForegroundColor Green
}
if ($verify -match "_next/image/:path\*") {
    Write-Host "WARN: /_next/image block still present" -ForegroundColor Yellow
} else {
    Write-Host "OK: /_next/image block removed" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Restore if needed:" -ForegroundColor Yellow
Write-Host "  Copy-Item -Path `"$backupPath`" -Destination `"$nextConfigPath`" -Force" -ForegroundColor White
Write-Host ""