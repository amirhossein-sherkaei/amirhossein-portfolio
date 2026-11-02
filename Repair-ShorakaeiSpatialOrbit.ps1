[CmdletBinding()]
param(
    [string]$ProjectRoot = (Get-Location).Path,
    [switch]$SkipBuild,
    [switch]$StartDevServer
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = [System.IO.Path]::GetFullPath($ProjectRoot)
$adapterPath = Join-Path $ProjectRoot 'src\lib\spatial-orbit-data.ts'
$packagePath = Join-Path $ProjectRoot 'package.json'

Write-Host ''
Write-Host '===============================================================' -ForegroundColor Cyan
Write-Host '   SHORAKAEI SPATIAL ORBIT — ADAPTER SYNTAX REPAIR' -ForegroundColor White
Write-Host '===============================================================' -ForegroundColor Cyan

if (-not (Test-Path -LiteralPath $packagePath -PathType Leaf)) {
    throw "package.json در مسیر پروژه پیدا نشد: $ProjectRoot"
}
if (-not (Test-Path -LiteralPath $adapterPath -PathType Leaf)) {
    throw "فایل آداپتور پیدا نشد: $adapterPath`nمسیر پروژه را درست وارد کن."
}

$content = [System.IO.File]::ReadAllText($adapterPath, [System.Text.Encoding]::UTF8)
if ($content -match 'const\s+isExternalHref\s*=\s*href\.startsWith\("https://"\)') {
    Write-Host 'فایل آداپتور قبلاً اصلاح شده است.' -ForegroundColor Green
    $alreadyFixed = $true
} else {
    $lines = [System.Collections.Generic.List[string]]::new()
    foreach ($line in [System.IO.File]::ReadAllLines($adapterPath, [System.Text.Encoding]::UTF8)) {
        $lines.Add($line)
    }

    $matches = @()
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i].Contains('href.startsWith') -and $lines[$i].Contains('test(href)')) {
            $matches += $i
        }
    }

    if ($matches.Count -ne 1) {
        throw "خط اعتبارسنجی URL دقیقاً یک‌بار پیدا نشد (تعداد: $($matches.Count)). برای جلوگیری از تغییر اشتباه، هیچ فایلی ویرایش نشد. محتوای src/lib/spatial-orbit-data.ts را بررسی کن."
    }

    $index = [int]$matches[0]
    $indent = ([regex]::Match($lines[$index], '^\s*')).Value
    $replacement = @(
        ($indent + 'const isExternalHref = href.startsWith("https://") || href.startsWith("http://");'),
        ($indent + 'if (!href.startsWith("/") && !isExternalHref) continue;')
    )

    $timestamp = (Get-Date).ToString('yyyy-MM-ddTHH-mm-ss-fff')
    $backupRoot = Join-Path $ProjectRoot ('.shorakaei-backups\spatial-orbit-hotfix-' + $timestamp)
    New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
    Copy-Item -LiteralPath $adapterPath -Destination (Join-Path $backupRoot 'spatial-orbit-data.ts') -Force

    $lines.RemoveAt($index)
    for ($j = $replacement.Count - 1; $j -ge 0; $j--) {
        $lines.Insert($index, $replacement[$j])
    }

    $newContent = [string]::Join([Environment]::NewLine, $lines) + [Environment]::NewLine
    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText($adapterPath, $newContent, $utf8NoBom)

    Write-Host 'خط اعتبارسنجی URL اصلاح شد.' -ForegroundColor Green
    Write-Host "نسخهٔ پشتیبان: $backupRoot" -ForegroundColor DarkGray
    $alreadyFixed = $false
}

if (-not $SkipBuild) {
    $pkg = Get-Content -LiteralPath $packagePath -Raw -Encoding UTF8 | ConvertFrom-Json
    if (-not $pkg.scripts -or -not $pkg.scripts.build) {
        Write-Warning 'اسکریپت build در package.json وجود ندارد؛ بررسی Build انجام نشد.'
        exit 0
    }

    $manager = 'npm'
    if (Test-Path (Join-Path $ProjectRoot 'pnpm-lock.yaml')) { $manager = 'pnpm' }
    elseif (Test-Path (Join-Path $ProjectRoot 'yarn.lock')) { $manager = 'yarn' }
    elseif ((Test-Path (Join-Path $ProjectRoot 'bun.lockb')) -or (Test-Path (Join-Path $ProjectRoot 'bun.lock'))) { $manager = 'bun' }

    Write-Host "در حال اجرای Build با $manager ..." -ForegroundColor Cyan
    Push-Location $ProjectRoot
    try {
        switch ($manager) {
            'pnpm' { & pnpm run build }
            'yarn' { & yarn build }
            'bun'  { & bun run build }
            default { & npm run build }
        }
        $buildExit = $LASTEXITCODE
    } finally {
        Pop-Location
    }

    if ($buildExit -ne 0) {
        Write-Host 'اصلاح فایل انجام شد، اما Build همچنان خطا دارد. متن خطای جدید را ارسال کن.' -ForegroundColor Yellow
        exit $buildExit
    }

    Write-Host 'Build با موفقیت انجام شد.' -ForegroundColor Green
} else {
    Write-Host 'بررسی Build با SkipBuild رد شد.' -ForegroundColor Yellow
}

if ($StartDevServer) {
    $pkg = Get-Content -LiteralPath $packagePath -Raw -Encoding UTF8 | ConvertFrom-Json
    if (-not $pkg.scripts -or -not $pkg.scripts.dev) {
        Write-Warning 'اسکریپت dev در package.json وجود ندارد؛ سرور اجرا نشد.'
    } else {
        $manager = 'npm'
        if (Test-Path (Join-Path $ProjectRoot 'pnpm-lock.yaml')) { $manager = 'pnpm' }
        elseif (Test-Path (Join-Path $ProjectRoot 'yarn.lock')) { $manager = 'yarn' }
        elseif ((Test-Path (Join-Path $ProjectRoot 'bun.lockb')) -or (Test-Path (Join-Path $ProjectRoot 'bun.lock'))) { $manager = 'bun' }
        $command = switch ($manager) {
            'pnpm' { 'pnpm dev' }
            'yarn' { 'yarn dev' }
            'bun'  { 'bun run dev' }
            default { 'npm run dev' }
        }
        $quotedRoot = $ProjectRoot.Replace("'", "''")
        Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoExit', '-Command', "Set-Location -LiteralPath '$quotedRoot'; $command") | Out-Null
        Start-Sleep -Seconds 3
        Start-Process 'http://localhost:3000' | Out-Null
        Write-Host 'سرور توسعه اجرا شد؛ مرورگر روی http://localhost:3000 باز شد.' -ForegroundColor Green
    }
}

Write-Host ''
Write-Host 'اصلاح آداپتور Spatial Orbit تمام شد.' -ForegroundColor Green
Write-Host 'هیچ صفحه، داده یا فایل دیگری تغییر نکرد.' -ForegroundColor Gray
