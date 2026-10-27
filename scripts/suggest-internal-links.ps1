# ============================================================
#  SMART INTERNAL LINKING (Run manually or via cron)
# ============================================================
# This script analyzes blog posts and suggests internal links based on shared tags.
# It does NOT automatically modify content to avoid SEO spam.

$ProjectRoot = "C:\Users\AmirHossien\Desktop\amirhossein-portfolio"
Set-Location $ProjectRoot
$blogDir = "src\content\blog"

$files = Get-ChildItem -Path $blogDir -Filter "*.md"
$articles = @()

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $title = ""
    $tags = @()
    if ($content -match 'title:\s*"(.*?)"') { $title = $matches[1] }
    if ($content -match 'tags:\s*\[(.*?)\]') {
        $tags = $matches[1] -split ',' | ForEach-Object { $_.Trim().Trim('"') }
    }
    $articles += [PSCustomObject]@{ File = $file.Name; Title = $title; Tags = $tags }
}

Write-Host "Suggested Internal Links:" -ForegroundColor Cyan
foreach ($article in $articles) {
    $related = $articles | Where-Object { $_.File -ne $article.File -and ($_.Tags | Where-Object { $article.Tags -contains $_ }) } | Select-Object -First 3
    if ($related) {
        Write-Host "`nFor article: $($article.Title)" -ForegroundColor Yellow
        foreach ($rel in $related) {
            Write-Host "  -> Link to: $($rel.Title) (File: $($rel.File))" -ForegroundColor Green
        }
    }
}
