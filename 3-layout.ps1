# 3-layout.ps1
# Updates layout.tsx: LazyChatBot import + DevOnly wrapper for GridOverlay

$ErrorActionPreference = "Stop"

$projectRoot = (Get-Location).Path
Write-Host ""
Write-Host "=== UPDATE LAYOUT.TSX ===" -ForegroundColor Cyan
Write-Host ""

$layoutPath = Join-Path $projectRoot "src\app\layout.tsx"

if (-not (Test-Path $layoutPath)) {
    Write-Host "ERROR: src\app\layout.tsx not found" -ForegroundColor Red
    exit 1
}

# Backup
$backupPath = "$layoutPath.bak"
Copy-Item -Path $layoutPath -Destination $backupPath -Force
Write-Host "Backup: $backupPath" -ForegroundColor Gray
Write-Host ""

# Read as UTF-8
$enc = New-Object System.Text.UTF8Encoding($false)
$content = [System.IO.File]::ReadAllText($layoutPath, [System.Text.Encoding]::UTF8)
$originalContent = $content
$changes = @()

# Detect newline style
if ($content.Contains("`r`n")) { $nl = "`r`n" } else { $nl = "`n" }

# 1) ChatBot import -> LazyChatBot
$oldChatImport = 'import { ChatBot } from "@/components/chat/ChatBot";'
$newChatImport = 'import { ChatBot } from "@/components/chat/LazyChatBot";'

if ($content.Contains($newChatImport)) {
    Write-Host "SKIP: ChatBot already lazy" -ForegroundColor Yellow
} elseif ($content.Contains($oldChatImport)) {
    $content = $content.Replace($oldChatImport, $newChatImport)
    $changes += "ChatBot -> LazyChatBot import"
    Write-Host "OK: ChatBot import updated" -ForegroundColor Green
} else {
    Write-Host "WARN: ChatBot import not found" -ForegroundColor Yellow
}

# 2) Add DevOnly import (before GridOverlay import)
$gridOverlayImport = 'import GridOverlay from "@/components/GridOverlay";'
$devOnlyImport = 'import DevOnly from "@/components/DevOnly";'

if ($content.Contains($devOnlyImport)) {
    Write-Host "SKIP: DevOnly already imported" -ForegroundColor Yellow
} elseif ($content.Contains($gridOverlayImport)) {
    $replacement = $devOnlyImport + $nl + $gridOverlayImport
    $content = $content.Replace($gridOverlayImport, $replacement)
    $changes += "Added DevOnly import"
    Write-Host "OK: DevOnly import added" -ForegroundColor Green
} else {
    Write-Host "WARN: GridOverlay import not found" -ForegroundColor Yellow
}

# 3) Wrap GridOverlay in DevOnly
$oldGridUsage = '<GridOverlay />'
$newGridUsage = '<DevOnly><GridOverlay /></DevOnly>'

if ($content.Contains($newGridUsage)) {
    Write-Host "SKIP: GridOverlay already wrapped" -ForegroundColor Yellow
} elseif ($content.Contains($oldGridUsage)) {
    $content = $content.Replace($oldGridUsage, $newGridUsage)
    $changes += "GridOverlay wrapped in DevOnly"
    Write-Host "OK: GridOverlay wrapped" -ForegroundColor Green
} else {
    Write-Host "WARN: GridOverlay usage not found" -ForegroundColor Yellow
}

# Save
if ($content -ne $originalContent) {
    [System.IO.File]::WriteAllText($layoutPath, $content, $enc)
    Write-Host ""
    Write-Host "Layout updated with $($changes.Count) change(s):" -ForegroundColor Green
    $changes | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
} else {
    Write-Host ""
    Write-Host "No changes were needed." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "If anything breaks, restore with:" -ForegroundColor Yellow
Write-Host "  Copy-Item -Path `"$backupPath`" -Destination `"$layoutPath`" -Force" -ForegroundColor White
Write-Host ""