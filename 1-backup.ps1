# 1-backup.ps1
# Creates a full timestamped backup of the portfolio project

$ErrorActionPreference = "Stop"

$projectRoot = (Get-Location).Path
Write-Host ""
Write-Host "=== BACKUP SCRIPT ===" -ForegroundColor Cyan
Write-Host "Project: $projectRoot" -ForegroundColor Gray
Write-Host ""

if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
    Write-Host "ERROR: package.json not found. Run from project root." -ForegroundColor Red
    exit 1
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path (Split-Path $projectRoot -Parent) "amirhossein-portfolio-backup-$timestamp"
$backupDataDir = Join-Path $backupRoot "project"

Write-Host "Creating backup at:" -ForegroundColor Yellow
Write-Host "  $backupRoot" -ForegroundColor White
Write-Host ""

New-Item -ItemType Directory -Path $backupDataDir -Force | Out-Null

$excludeDirs = @("node_modules", ".next", ".vercel", ".turbo", "dist", "build", "out")
$existingBackups = Get-ChildItem -Path $projectRoot -Filter ".backup-*" -Directory -ErrorAction SilentlyContinue
if ($existingBackups) {
    $excludeDirs += $existingBackups.Name
}

$robocopyArgs = @($projectRoot, $backupDataDir, "/E", "/NFL", "/NDL", "/NJH", "/NJS", "/R:2", "/W:1", "/XD") + $excludeDirs

Write-Host "Copying files..." -ForegroundColor Yellow
& robocopy @robocopyArgs | Out-Null

if ($LASTEXITCODE -ge 8) {
    Write-Host "ERROR: robocopy failed with code $LASTEXITCODE" -ForegroundColor Red
    exit 1
}

$fileCount = (Get-ChildItem -Path $backupDataDir -Recurse -File).Count
$sizeMB = [math]::Round(((Get-ChildItem -Path $backupDataDir -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB), 2)

Write-Host "Backup complete: $fileCount files, $sizeMB MB" -ForegroundColor Green
Write-Host ""

# Git tag if available
if (Test-Path (Join-Path $projectRoot ".git")) {
    try {
        $tagName = "backup-$timestamp"
        git tag -a $tagName -m "Backup on $timestamp" 2>&1 | Out-Null
        Write-Host "Git tag created: $tagName" -ForegroundColor Green
    } catch {
        Write-Host "Git tag skipped: $_" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== BACKUP DONE ===" -ForegroundColor Cyan
Write-Host "Restore command:" -ForegroundColor Yellow
Write-Host "  Copy-Item -Path `"$backupDataDir\*`" -Destination `"$projectRoot`" -Recurse -Force" -ForegroundColor White
Write-Host ""