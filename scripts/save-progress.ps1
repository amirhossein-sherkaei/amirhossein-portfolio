# ═══════════════════════════════════════════════════════════════
# AUTO-SAVE PROGRESS — ذخیره‌ی خودکار پیشرفت
# ═══════════════════════════════════════════════════════════════

$ErrorActionPreference = "Continue"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

Write-Host ""
Write-Host "💾 ذخیره‌ی خودکار پیشرفت..." -ForegroundColor Cyan
Write-Host ""

# ─── وضعیت فعلی ───
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$branch = git branch --show-current
$commitHash = git rev-parse --short HEAD

# ─── فایل‌های تغییر‌یافته ───
$changed = git status --short
$changedCount = ($changed | Measure-Object).Count

Write-Host "   Branch: $branch" -ForegroundColor Gray
Write-Host "   Commit: $commitHash" -ForegroundColor Gray
Write-Host "   Files changed: $changedCount" -ForegroundColor Gray
Write-Host ""

# ─── ساخت متن auto-save با concatenation ───
$changedText = if ($changed) { $changed -join "`n" } else { "(no changes)" }

$autoSection = @'


<!-- AUTO-SAVE-START -->
---

## آخرین وضعیت (Auto-Save)

**تاریخ:** TIMESTAMP_PLACEHOLDER
**Branch:** BRANCH_PLACEHOLDER
**آخرین Commit:** COMMIT_PLACEHOLDER

### فایل‌های تغییر‌یافته:

CHANGED_PLACEHOLDER

### برای ادامه در چت جدید:

1. این فایل + PROJECT_STATE.md رو به AI جدید نشون بده
2. بگو: «من در حال ساخت Lost Garden هستم. بریم ادامه»
3. AI جدید از همین نقطه ادامه می‌ده

<!-- AUTO-SAVE-END -->
'@

# ─── جایگزینی placeholderها ───
$autoSection = $autoSection.Replace('TIMESTAMP_PLACEHOLDER', $timestamp)
$autoSection = $autoSection.Replace('BRANCH_PLACEHOLDER', $branch)
$autoSection = $autoSection.Replace('COMMIT_PLACEHOLDER', $commitHash)
$autoSection = $autoSection.Replace('CHANGED_PLACEHOLDER', $changedText)

# ─── آپدیت CHAT_HANDOFF.md ───
$handoffPath = "$PWD\CHAT_HANDOFF.md"

if (Test-Path $handoffPath) {
    $handoff = [System.IO.File]::ReadAllText($handoffPath, [System.Text.Encoding]::UTF8)

    # حذف بخش auto-save قبلی
    $startMarker = '<!-- AUTO-SAVE-START -->'
    $endMarker = '<!-- AUTO-SAVE-END -->'

    $startIndex = $handoff.IndexOf($startMarker)
    if ($startIndex -ge 0) {
        $endIndex = $handoff.IndexOf($endMarker, $startIndex)
        if ($endIndex -ge 0) {
            $before = $handoff.Substring(0, $startIndex).TrimEnd()
            $after = $handoff.Substring($endIndex + $endMarker.Length).TrimStart()
            $handoff = $before + "`r`n" + $after
        }
    }

    # اضافه‌کردن بخش جدید
    $handoff = $handoff.TrimEnd() + "`r`n" + $autoSection
    [System.IO.File]::WriteAllText($handoffPath, $handoff, $utf8NoBom)
    Write-Host "   CHAT_HANDOFF.md آپدیت شد" -ForegroundColor Green
} else {
    Write-Host "   CHAT_HANDOFF.md پیدا نشد" -ForegroundColor Yellow
}

# ─── Git commit + push ───
Write-Host ""
Write-Host "   Git commit + push..." -ForegroundColor Yellow

git add . 2>&1 | Out-Null
git commit -m "auto-save: $timestamp" 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    git push origin $branch 2>&1 | Out-Null
    Write-Host "   ذخیره شد و push شد" -ForegroundColor Green
} else {
    Write-Host "   چیزی برای commit نبود" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "پیشرفت ذخیره شد!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""