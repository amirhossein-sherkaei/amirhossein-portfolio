# 8-prefetch.ps1
# Disables Next.js auto-prefetch on /order and /blog links.
# Pages now load only AFTER user clicks (or navigates).
# Only modifies specific <Link> tags. Nothing else is touched.

$ErrorActionPreference = "Stop"
$root = (Get-Location).Path

Write-Host ""
Write-Host "=== PREFETCH OPTIMIZATION ===" -ForegroundColor Cyan
Write-Host "Goal: /order and /blog load only after click" -ForegroundColor Gray
Write-Host ""

if (-not (Test-Path (Join-Path $root "package.json"))) {
    Write-Host "ERROR: package.json not found. Run from project root." -ForegroundColor Red
    exit 1
}

$targets = @(
    "src\components\Nav.tsx",
    "src\components\MobileNav.tsx",
    "src\components\Hero.tsx",
    "src\components\Footer.tsx",
    "src\components\FinalCTA.tsx",
    "src\components\LatestBlogPosts.tsx",
    "src\components\BlogEndCTA.tsx",
    "src\components\BlogInlineCTA.tsx",
    "src\components\BlogAuthorBox.tsx",
    "src\components\BlogList.tsx"
)

$globalChanges = 0

foreach ($rel in $targets) {
    $path = Join-Path $root $rel
    if (-not (Test-Path $path)) {
        Write-Host "  SKIP (not found): $rel" -ForegroundColor Yellow
        continue
    }

    # یه بکاپ بگیر (فقط بار اول)
    $bak = "$path.prefetch.bak"
    if (-not (Test-Path $bak)) {
        Copy-Item $path $bak
    }

    $enc = New-Object System.Text.UTF8Encoding($false)
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $beforeCount = ([regex]::Matches($content, 'prefetch=\{false\}')).Count

    $callback = {
        param($m)
        $tag = $m.Value

        $hasTarget = $false
        if ($tag -match 'href="(?:/order|/blog)"') { $hasTarget = $true }
        if ($tag -match 'href=\{`/blog/[^`]+`\}') { $hasTarget = $true }
        if (-not $hasTarget) { return $tag }

        if ($tag -match 'prefetch\s*=') { return $tag }

        return ($tag -replace '(href="(?:/order|/blog)"|href=\{`/blog/[^`]+`\})', '$1 prefetch={false}')
    }

    $content = [regex]::Replace(
        $content,
        '<Link\b[^>]*?>',
        [System.Text.RegularExpressions.MatchEvaluator]$callback
    )

    $afterCount = ([regex]::Matches($content, 'prefetch=\{false\}')).Count
    $diff = $afterCount - $beforeCount

    if ($diff -gt 0) {
        [System.IO.File]::WriteAllText($path, $content, $enc)
        Write-Host "  OK ($diff link(s)): $rel" -ForegroundColor Green
        $globalChanges += $diff
    } else {
        Write-Host "  --: $rel" -ForegroundColor Gray
    }
}

Write-Host ""
if ($globalChanges -gt 0) {
    Write-Host "DONE: $globalChanges Link(s) now have prefetch={false}" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step:" -ForegroundColor Yellow
    Write-Host "  npm run build" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "No changes made (all target links already disabled)." -ForegroundColor Yellow
}