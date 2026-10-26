<#
.SYNOPSIS
    Safe, non-destructive project inspection for shorakaei.ir.
#>

[CmdletBinding()]
param(
    [string]$ProjectRoot = (Get-Location).Path,
    [string]$OutputRoot = "",
    [switch]$SkipZip
)

$ErrorActionPreference = "Continue"

$script:Warnings = New-Object System.Collections.Generic.List[string]
$script:FileRecords = New-Object System.Collections.Generic.List[object]
$script:ProjectRoot = $null
$script:ExcludedDirNames = @(
    "node_modules",
    ".git",
    ".next",
    ".nuxt",
    ".output",
    "dist",
    "build",
    "coverage",
    ".cache",
    ".parcel-cache",
    ".turbo",
    ".vercel",
    "vendor",
    "bin",
    "obj",
    ".idea",
    ".vscode",
    ".sass-cache"
)
$script:ExcludedDirRegex = "^_audit-shorakaei-"

function Add-Warning {
    param([string]$Message)
    $script:Warnings.Add($Message) | Out-Null
    Write-Host "WARN: $Message" -ForegroundColor Yellow
}

function Ensure-Directory {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

function Write-Utf8NoBom {
    param(
        [string]$Path,
        [string]$Content
    )
    $enc = New-Object System.Text.UTF8Encoding -ArgumentList $false
    [System.IO.File]::WriteAllText($Path, $Content, $enc)
}

function Get-RelativePathSafe {
    param(
        [string]$Base,
        [string]$Path
    )
    $baseFull = [System.IO.Path]::GetFullPath($Base)
    if (-not $baseFull.EndsWith([System.IO.Path]::DirectorySeparatorChar)) {
        $baseFull = $baseFull + [System.IO.Path]::DirectorySeparatorChar
    }
    $pathFull = [System.IO.Path]::GetFullPath($Path)
    $baseUri = New-Object System.Uri -ArgumentList $baseFull
    $pathUri = New-Object System.Uri -ArgumentList $pathFull
    $rel = $baseUri.MakeRelativeUri($pathUri).ToString()
    return [System.Uri]::UnescapeDataString($rel).Replace("/", [System.IO.Path]::DirectorySeparatorChar)
}

function Get-ToolVersion {
    param(
        [string]$Name,
        [string[]]$Arguments = @("--version")
    )
    $cmd = Get-Command $Name -ErrorAction SilentlyContinue
    if ($null -eq $cmd) {
        return "not installed"
    }
    try {
        $output = & $Name @Arguments 2>&1 | Select-Object -First 1
        if ($null -eq $output) {
            return "installed; no version output"
        }
        return ([string]$output).Trim()
    }
    catch {
        return "installed; version check failed: $($_.Exception.Message)"
    }
}

function Get-DiskInfo {
    param([string]$Path)
    try {
        $full = [System.IO.Path]::GetFullPath($Path)
        $drive = Get-PSDrive -PSProvider FileSystem -ErrorAction SilentlyContinue |
            Where-Object { $full.StartsWith($_.Root, [System.StringComparison]::OrdinalIgnoreCase) } |
            Sort-Object { $_.Root.Length } -Descending |
            Select-Object -First 1
        if ($null -ne $drive) {
            $freeGb = [math]::Round($drive.Free / 1GB, 2)
            $usedGb = [math]::Round($drive.Used / 1GB, 2)
            return "Drive $($drive.Name): free $freeGb GB; used $usedGb GB"
        }
    }
    catch {
        return "unavailable"
    }
    return "unavailable"
}

function Get-TextLineCountSafe {
    param([string]$Path)
    $reader = $null
    try {
        $reader = New-Object System.IO.StreamReader -ArgumentList @($Path, [System.Text.Encoding]::UTF8, $true)
        $count = 0
        while ($null -ne $reader.ReadLine()) {
            $count++
        }
        return $count
    }
    catch {
        Add-Warning "Could not count lines: $Path"
        return $null
    }
    finally {
        if ($null -ne $reader) {
            $reader.Dispose()
        }
    }
}

function Read-JsonFileSafe {
    param([string]$Path)
    try {
        $raw = Get-Content -LiteralPath $Path -Raw -Encoding UTF8 -ErrorAction Stop
        return ($raw | ConvertFrom-Json)
    }
    catch {
        Add-Warning "Could not parse JSON file: $Path"
        return $null
    }
}

function Get-RedactedText {
    param([string]$Text)
    if ([string]::IsNullOrWhiteSpace($Text)) {
        return ""
    }
    $result = $Text
    $result = [regex]::Replace(
        $result,
        "(?i)(password|passwd|pwd|secret|token|api[_-]?key|private[_-]?key|authorization|bearer)(\s*[:=]\s*)([^\s,;]+)",
        '$1$2[REDACTED]'
    )
    return $result
}

function Walk-Project {
    param([string]$Directory)
    $children = $null
    try {
        $children = Get-ChildItem -LiteralPath $Directory -Force -ErrorAction Stop
    }
    catch {
        Add-Warning "Cannot read directory: $Directory"
        return
    }

    foreach ($child in $children) {
        try {
            if ($child.PSIsContainer) {
                if ($script:ExcludedDirNames -contains $child.Name) {
                    continue
                }
                if ($child.Name -match $script:ExcludedDirRegex) {
                    continue
                }
                if (($child.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
                    Add-Warning "Skipped reparse-point directory: $($child.FullName)"
                    continue
                }
                Walk-Project -Directory $child.FullName
            }
            else {
                $rel = Get-RelativePathSafe -Base $script:ProjectRoot -Path $child.FullName
                $record = [PSCustomObject]@{
                    FullName      = $child.FullName
                    RelativePath  = $rel
                    Name          = $child.Name
                    Extension     = ([string]$child.Extension).ToLowerInvariant()
                    Length        = [int64]$child.Length
                    LastWriteTime = $child.LastWriteTime
                }
                $script:FileRecords.Add($record) | Out-Null
            }
        }
        catch {
            Add-Warning "Could not inspect item: $($child.FullName)"
        }
    }
}

if (-not (Test-Path -LiteralPath $ProjectRoot -PathType Container)) {
    Write-Error "Project root was not found: $ProjectRoot"
    exit 2
}

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
$script:ProjectRoot = $ProjectRoot

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
if ([string]::IsNullOrWhiteSpace($OutputRoot)) {
    $OutputRoot = Join-Path $ProjectRoot ("_audit-shorakaei-" + $timestamp)
}
else {
    if (-not [System.IO.Path]::IsPathRooted($OutputRoot)) {
        $OutputRoot = Join-Path $ProjectRoot $OutputRoot
    }
}
$OutputRoot = [System.IO.Path]::GetFullPath($OutputRoot)

Write-Host "Inspecting project: $ProjectRoot" -ForegroundColor Cyan
Write-Host "Output directory: $OutputRoot" -ForegroundColor Cyan

Walk-Project -Directory $ProjectRoot

Ensure-Directory -Path $OutputRoot

$allRel = @($script:FileRecords | ForEach-Object { $_.RelativePath })
$sourceExtensions = @(".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".vue", ".svelte", ".astro", ".css", ".scss", ".sass", ".less", ".html", ".md", ".mdx", ".json", ".yml", ".yaml")
$textExtensions = $sourceExtensions

$packageJsonPath = Join-Path $ProjectRoot "package.json"
$package = $null
if (Test-Path -LiteralPath $packageJsonPath -PathType Leaf) {
    $package = Read-JsonFileSafe -Path $packageJsonPath
}
else {
    Add-Warning "package.json was not found at the project root."
}

$packageDeps = New-Object System.Collections.Generic.List[object]
if ($null -ne $package) {
    foreach ($section in @("dependencies", "devDependencies", "peerDependencies", "optionalDependencies")) {
        $sectionObject = $package.$section
        if ($null -ne $sectionObject) {
            foreach ($property in $sectionObject.PSObject.Properties) {
                $packageDeps.Add([PSCustomObject]@{
                    Section = $section
                    Name    = $property.Name
                    Version = [string]$property.Value
                }) | Out-Null
            }
        }
    }
}

$depNames = @($packageDeps | ForEach-Object { $_.Name })
$hasNext = $depNames -contains "next"
$hasNuxt = $depNames -contains "nuxt"
$hasSvelteKit = $depNames -contains "@sveltejs/kit"
$hasSvelte = $depNames -contains "svelte"
$hasAstro = $depNames -contains "astro"
$hasGatsby = $depNames -contains "gatsby"
$hasRemix = $depNames -contains "@remix-run/react"
$hasVue = $depNames -contains "vue"
$hasReact = $depNames -contains "react"
$hasAngular = $depNames -contains "@angular/core"
$hasVite = $depNames -contains "vite"
$hasTailwind = $depNames -contains "tailwindcss"
$hasSass = ($depNames -contains "sass") -or ($depNames -contains "node-sass")
$hasStyledComponents = $depNames -contains "styled-components"
$hasEmotion = ($depNames -contains "@emotion/react") -or ($depNames -contains "@emotion/styled")
$hasPrisma = ($depNames -contains "prisma") -or ($depNames -contains "@prisma/client")
$hasMongoose = $depNames -contains "mongoose"
$hasSequelize = $depNames -contains "sequelize"
$hasTypeOrm = $depNames -contains "typeorm"
$hasDrizzle = ($depNames -contains "drizzle-orm") -or ($depNames -contains "drizzle-kit")
$hasSupabase = ($depNames -contains "@supabase/supabase-js") -or ($depNames -contains "supabase")
$hasFirebase = ($depNames -contains "firebase") -or ($depNames -contains "firebase-admin")
$hasSanity = ($depNames -contains "sanity") -or ($depNames -contains "@sanity/client")
$hasContentful = $depNames -contains "contentful"
$hasStrapi = ($depNames -contains "@strapi/strapi") -or ($depNames -contains "strapi")
$hasJest = $depNames -contains "jest"
$hasVitest = $depNames -contains "vitest"
$hasPlaywright = ($depNames -contains "@playwright/test") -or ($depNames -contains "playwright")
$hasCypress = $depNames -contains "cypress"
$hasTestingLibrary = ($depNames | Where-Object { $_ -like "@testing-library/*" } | Select-Object -First 1) -ne $null
$hasEslint = ($depNames -contains "eslint") -or (($depNames | Where-Object { $_ -like "eslint-*" } | Select-Object -First 1) -ne $null)
$hasPrettier = $depNames -contains "prettier"
$hasStylelint = ($depNames -contains "stylelint") -or (($depNames | Where-Object { $_ -like "stylelint-*" } | Select-Object -First 1) -ne $null)

$lockFileNames = @("package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb")
$lockFiles = @($script:FileRecords | Where-Object { $lockFileNames -contains $_.Name } | Select-Object -ExpandProperty RelativePath)
$configFileNamesRegex = "^(package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb|tsconfig.*\.json|next\.config\..*|vite\.config\..*|astro\.config\..*|nuxt\.config\..*|svelte\.config\..*|tailwind\.config\..*|postcss\.config\..*|eslint.*|\.eslintrc.*|prettier.*|\.prettierrc.*|angular\.json|gatsby-config\..*|remix\.config\..*)$"
$configFiles = @($script:FileRecords | Where-Object { $_.Name -match $configFileNamesRegex } | Sort-Object RelativePath | Select-Object -ExpandProperty RelativePath)

$tsFiles = @($script:FileRecords | Where-Object { $_.Extension -in @(".ts", ".tsx") })
$tsxFiles = @($script:FileRecords | Where-Object { $_.Extension -eq ".tsx" })
$jsFiles = @($script:FileRecords | Where-Object { $_.Extension -in @(".js", ".jsx", ".mjs", ".cjs") })
$cssFiles = @($script:FileRecords | Where-Object { $_.Extension -in @(".css", ".scss", ".sass", ".less") })
$cssModuleFiles = @($cssFiles | Where-Object { $_.Name -match "\.module\.(css|scss|sass|less)$" })
$fontFiles = @($script:FileRecords | Where-Object { $_.Extension -in @(".woff", ".woff2", ".ttf", ".otf", ".eot") })
$imageFiles = @($script:FileRecords | Where-Object { $_.Extension -in @(".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg") })
$mdFiles = @($script:FileRecords | Where-Object { $_.Extension -in @(".md", ".mdx") })

$hasAppRouter = @($allRel | Where-Object { $_ -match "(^|[\\/])app[\\/].*(page|layout|route)\.(tsx|ts|jsx|js|mdx)$" }).Count -gt 0
$hasPagesRouter = @($allRel | Where-Object { $_ -match "(^|[\\/])pages[\\/].*(\.tsx|\.ts|\.jsx|\.js|\.mdx)$" }).Count -gt 0
$hasApiRoutes = @($allRel | Where-Object { $_ -match "(^|[\\/])(api|server|actions)[\\/]" }).Count -gt 0
$hasPrismaSchema = @($allRel | Where-Object { $_ -match "(^|[\\/])prisma[\\/]schema\.prisma$" }).Count -gt 0
$hasSupabaseDir = @($allRel | Where-Object { $_ -match "(^|[\\/])supabase[\\/]" }).Count -gt 0

$envFiles = @($script:FileRecords | Where-Object { $_.Name -like ".env*" })
$envSummary = New-Object System.Collections.Generic.List[string]
foreach ($envFile in $envFiles) {
    $variableNames = New-Object System.Collections.Generic.List[string]
    try {
        $lines = Get-Content -LiteralPath $envFile.FullName -ErrorAction Stop
        foreach ($line in $lines) {
            if ($line -match "^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=") {
                $variableNames.Add($Matches[1]) | Out-Null
            }
        }
    }
    catch {
        Add-Warning "Could not read env file variable names: $($envFile.RelativePath)"
    }
    $namesText = if ($variableNames.Count -gt 0) { ($variableNames | Sort-Object -Unique) -join ", " } else { "(no variable names detected)" }
    $envSummary.Add("$($envFile.RelativePath): $namesText") | Out-Null
}

$largeFiles = New-Object System.Collections.Generic.List[string]
foreach ($file in $script:FileRecords) {
    if (($textExtensions -contains $file.Extension) -and $file.Length -lt 2097152) {
        $lineCount = Get-TextLineCountSafe -Path $file.FullName
        if ($null -ne $lineCount -and $lineCount -ge 400) {
            $largeFiles.Add("$($file.RelativePath) - $lineCount lines") | Out-Null
        }
    }
}

$fontHashes = @{}
foreach ($font in $fontFiles) {
    try {
        $hash = (Get-FileHash -LiteralPath $font.FullName -Algorithm SHA256 -ErrorAction Stop).Hash
        if (-not $fontHashes.ContainsKey($hash)) {
            $fontHashes[$hash] = New-Object System.Collections.Generic.List[string]
        }
        $fontHashes[$hash].Add($font.RelativePath) | Out-Null
    }
    catch {
        Add-Warning "Could not hash font file: $($font.RelativePath)"
    }
}
$duplicateFontGroups = @($fontHashes.GetEnumerator() | Where-Object { $_.Value.Count -gt 1 })

$testScriptNames = @()
$scriptNames = @()
if ($null -ne $package -and $null -ne $package.scripts) {
    $scriptNames = @($package.scripts.PSObject.Properties | ForEach-Object { $_.Name })
    $testScriptNames = @($scriptNames | Where-Object { $_ -match "(?i)(test|lint|typecheck|type-check|check|build)" })
}
if ($testScriptNames.Count -eq 0) {
    Add-Warning "No test, lint, type-check, or build scripts were detected in package.json."
}

$gitVersion = Get-ToolVersion -Name "git" -Arguments @("--version")
$nodeVersion = Get-ToolVersion -Name "node" -Arguments @("--version")
$npmVersion = Get-ToolVersion -Name "npm" -Arguments @("--version")
$pnpmVersion = Get-ToolVersion -Name "pnpm" -Arguments @("--version")
$yarnVersion = Get-ToolVersion -Name "yarn" -Arguments @("--version")
$bunVersion = Get-ToolVersion -Name "bun" -Arguments @("--version")

$frameworkList = New-Object System.Collections.Generic.List[string]
if ($hasNext) { $frameworkList.Add("Next.js") | Out-Null }
if ($hasNuxt) { $frameworkList.Add("Nuxt") | Out-Null }
if ($hasSvelteKit) { $frameworkList.Add("SvelteKit") | Out-Null }
if ($hasSvelte -and -not $hasSvelteKit) { $frameworkList.Add("Svelte") | Out-Null }
if ($hasAstro) { $frameworkList.Add("Astro") | Out-Null }
if ($hasGatsby) { $frameworkList.Add("Gatsby") | Out-Null }
if ($hasRemix) { $frameworkList.Add("Remix") | Out-Null }
if ($hasVue -and -not $hasNuxt) { $frameworkList.Add("Vue") | Out-Null }
if ($hasReact -and -not $hasNext -and -not $hasGatsby -and -not $hasRemix) { $frameworkList.Add("React") | Out-Null }
if ($hasAngular) { $frameworkList.Add("Angular") | Out-Null }
if ($hasVite) { $frameworkList.Add("Vite") | Out-Null }

$cssList = New-Object System.Collections.Generic.List[string]
if ($hasTailwind) { $cssList.Add("Tailwind CSS") | Out-Null }
if ($hasSass -or $cssFiles.Count -gt 0) { $cssList.Add("Sass/SCSS or plain CSS files") | Out-Null }
if ($cssModuleFiles.Count -gt 0) { $cssList.Add("CSS Modules") | Out-Null }
if ($hasStyledComponents) { $cssList.Add("styled-components") | Out-Null }
if ($hasEmotion) { $cssList.Add("Emotion") | Out-Null }
if ($cssList.Count -eq 0) { $cssList.Add("No obvious CSS system detected from dependencies; inspect CSS files manually.") | Out-Null }

$dataList = New-Object System.Collections.Generic.List[string]
if ($hasPrisma -or $hasPrismaSchema) { $dataList.Add("Prisma") | Out-Null }
if ($hasMongoose) { $dataList.Add("Mongoose/MongoDB") | Out-Null }
if ($hasSequelize) { $dataList.Add("Sequelize") | Out-Null }
if ($hasTypeOrm) { $dataList.Add("TypeORM") | Out-Null }
if ($hasDrizzle) { $dataList.Add("Drizzle ORM") | Out-Null }
if ($hasSupabase -or $hasSupabaseDir) { $dataList.Add("Supabase") | Out-Null }
if ($hasFirebase) { $dataList.Add("Firebase") | Out-Null }
if ($hasSanity) { $dataList.Add("Sanity") | Out-Null }
if ($hasContentful) { $dataList.Add("Contentful") | Out-Null }
if ($hasStrapi) { $dataList.Add("Strapi") | Out-Null }
if ($dataList.Count -eq 0) { $dataList.Add("No obvious CMS/database dependency detected.") | Out-Null }

$testList = New-Object System.Collections.Generic.List[string]
if ($hasJest) { $testList.Add("Jest") | Out-Null }
if ($hasVitest) { $testList.Add("Vitest") | Out-Null }
if ($hasPlaywright) { $testList.Add("Playwright") | Out-Null }
if ($hasCypress) { $testList.Add("Cypress") | Out-Null }
if ($hasTestingLibrary) { $testList.Add("Testing Library") | Out-Null }
if ($hasEslint) { $testList.Add("ESLint") | Out-Null }
if ($hasPrettier) { $testList.Add("Prettier") | Out-Null }
if ($hasStylelint) { $testList.Add("Stylelint") | Out-Null }
if ($testList.Count -eq 0) { $testList.Add("No obvious test/lint tooling detected from dependencies.") | Out-Null }

$auditLines = New-Object System.Collections.Generic.List[string]
$auditLines.Add("PROJECT AUDIT - SHORAKAEI.IR") | Out-Null
$auditLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')") | Out-Null
$auditLines.Add("Project root: $ProjectRoot") | Out-Null
$auditLines.Add("Output directory: $OutputRoot") | Out-Null
$auditLines.Add("") | Out-Null
$auditLines.Add("=== ENVIRONMENT ===") | Out-Null
$auditLines.Add("PowerShell: $($PSVersionTable.PSVersion.ToString())") | Out-Null
$auditLines.Add("OS: $([System.Environment]::OSVersion.VersionString)") | Out-Null
$auditLines.Add("Disk: $(Get-DiskInfo -Path $ProjectRoot)") | Out-Null
$auditLines.Add("Git: $gitVersion") | Out-Null
$auditLines.Add("Node.js: $nodeVersion") | Out-Null
$auditLines.Add("npm: $npmVersion") | Out-Null
$auditLines.Add("pnpm: $pnpmVersion") | Out-Null
$auditLines.Add("yarn: $yarnVersion") | Out-Null
$auditLines.Add("bun: $bunVersion") | Out-Null
$auditLines.Add("") | Out-Null
$auditLines.Add("=== FILE SUMMARY ===") | Out-Null
$auditLines.Add("Files inspected: $($script:FileRecords.Count)") | Out-Null
$auditLines.Add("TypeScript files: $($tsFiles.Count)") | Out-Null
$auditLines.Add("TSX files: $($tsxFiles.Count)") | Out-Null
$auditLines.Add("JavaScript files: $($jsFiles.Count)") | Out-Null
$auditLines.Add("CSS/SCSS/Sass/Less files: $($cssFiles.Count)") | Out-Null
$auditLines.Add("CSS Module files: $($cssModuleFiles.Count)") | Out-Null
$auditLines.Add("Font files: $($fontFiles.Count)") | Out-Null
$auditLines.Add("Image/SVG files: $($imageFiles.Count)") | Out-Null
$auditLines.Add("Markdown/MDX files: $($mdFiles.Count)") | Out-Null
$auditLines.Add("") | Out-Null
$auditLines.Add("=== DETECTED TECHNOLOGY ===") | Out-Null
$auditLines.Add("Frameworks/build tools: $($frameworkList -join ', ')") | Out-Null
$auditLines.Add("CSS system hints: $($cssList -join ', ')") | Out-Null
$auditLines.Add("CMS/database hints: $($dataList -join ', ')") | Out-Null
$auditLines.Add("Test/lint tooling hints: $($testList -join ', ')") | Out-Null
$auditLines.Add("Next.js App Router files detected: $hasAppRouter") | Out-Null
$auditLines.Add("Pages Router files detected: $hasPagesRouter") | Out-Null
$auditLines.Add("API/server/actions paths detected: $hasApiRoutes") | Out-Null
$auditLines.Add("Prisma schema detected: $hasPrismaSchema") | Out-Null
$auditLines.Add("Supabase directory detected: $hasSupabaseDir") | Out-Null
$auditLines.Add("Package lock files: $(if ($lockFiles.Count -gt 0) { $lockFiles -join ', ' } else { 'none detected' })") | Out-Null
$auditLines.Add("") | Out-Null
$auditLines.Add("=== KEY CONFIGURATION FILES ===") | Out-Null
if ($configFiles.Count -gt 0) {
    foreach ($configFile in $configFiles) {
        $auditLines.Add("- $configFile") | Out-Null
    }
}
else {
    $auditLines.Add("(none detected by name)") | Out-Null
}
$auditLines.Add("") | Out-Null
$auditLines.Add("=== INITIAL QUALITY OBSERVATIONS ===") | Out-Null
$auditLines.Add("Large text/source files at or above 400 lines:") | Out-Null
if ($largeFiles.Count -gt 0) {
    foreach ($largeFile in $largeFiles) {
        $auditLines.Add("- $largeFile") | Out-Null
    }
}
else {
    $auditLines.Add("(none detected under the configured size limit)") | Out-Null
}
$auditLines.Add("") | Out-Null
$auditLines.Add("Duplicate font files by SHA256:") | Out-Null
if ($duplicateFontGroups.Count -gt 0) {
    foreach ($group in $duplicateFontGroups) {
        $auditLines.Add("- Duplicate group:") | Out-Null
        foreach ($fontPath in $group.Value) {
            $auditLines.Add("  - $fontPath") | Out-Null
        }
    }
}
else {
    $auditLines.Add("(none detected)") | Out-Null
}
$auditLines.Add("") | Out-Null
$auditLines.Add("=== LIMITATIONS ===") | Out-Null
$auditLines.Add("This inspection script does not run build, type-check, lint, unit tests, browser tests, or deployment commands.") | Out-Null
$auditLines.Add("This inspection script does not verify visual rendering, responsive behavior, accessibility compliance, SEO validity, or comment submission behavior.") | Out-Null
$auditLines.Add("Warnings are recorded in audit-warnings.txt.") | Out-Null
$auditLines.Add("No source files were modified by this script.") | Out-Null

$treeLines = New-Object System.Collections.Generic.List[string]
$treeLines.Add("PROJECT TREE - relative paths") | Out-Null
$treeLines.Add("Generated/generated-like directories excluded: $($script:ExcludedDirNames -join ', ')") | Out-Null
$treeLines.Add("") | Out-Null
foreach ($rel in ($script:FileRecords | Sort-Object RelativePath | Select-Object -ExpandProperty RelativePath)) {
    $treeLines.Add($rel) | Out-Null
}

$blogPatterns = @(
    [PSCustomObject]@{ Category = "Blog list/index"; Pattern = "(?i)(^|[\\/])(blog|articles|posts|weblog|magazine)([\\/]|$)" },
    [PSCustomObject]@{ Category = "Article page / slug"; Pattern = "(?i)(^|[\\/])(article|post|blog)[\\/].*(\[.*\]|index|page|detail)\.(tsx|jsx|ts|js|mdx|vue|svelte|astro)$" },
    [PSCustomObject]@{ Category = "Article card"; Pattern = "(?i)(article|post|blog)?card" },
    [PSCustomObject]@{ Category = "Article header"; Pattern = "(?i)(article|post)header|blogheader" },
    [PSCustomObject]@{ Category = "Cover/hero/thumbnail"; Pattern = "(?i)(cover|hero|thumbnail|featured|og-image)" },
    [PSCustomObject]@{ Category = "Table of contents"; Pattern = "(?i)(toc|tableofcontents|contents)" },
    [PSCustomObject]@{ Category = "Author block"; Pattern = "(?i)author" },
    [PSCustomObject]@{ Category = "Related articles"; Pattern = "(?i)(related|more-posts|suggested)" },
    [PSCustomObject]@{ Category = "CTA/newsletter"; Pattern = "(?i)(cta|calltoaction|newsletter|subscribe)" },
    [PSCustomObject]@{ Category = "Comments UI"; Pattern = "(?i)comment" },
    [PSCustomObject]@{ Category = "Comment API/action"; Pattern = "(?i)((api|server|actions).*comment|comment.*(api|route|action))" },
    [PSCustomObject]@{ Category = "Validation/schema"; Pattern = "(?i)(validation|schema|zod|yup|joi)" },
    [PSCustomObject]@{ Category = "Pagination/load more"; Pattern = "(?i)(pagination|loadmore|load-more|pager)" },
    [PSCustomObject]@{ Category = "Breadcrumb"; Pattern = "(?i)breadcrumb" },
    [PSCustomObject]@{ Category = "Metadata/SEO/structured data"; Pattern = "(?i)(metadata|seo|jsonld|structured|schema)" }
)

$blogLines = New-Object System.Collections.Generic.List[string]
$blogLines.Add("BLOG FILE MAP - shorakaei.ir") | Out-Null
$blogLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')") | Out-Null
$blogLines.Add("") | Out-Null
foreach ($patternItem in $blogPatterns) {
    $matches = @($script:FileRecords | Where-Object { $_.RelativePath -match $patternItem.Pattern } | Sort-Object RelativePath)
    $blogLines.Add("## $($patternItem.Category)") | Out-Null
    if ($matches.Count -gt 0) {
        foreach ($match in $matches) {
            $blogLines.Add("- $($match.RelativePath)") | Out-Null
        }
    }
    else {
        $blogLines.Add("(no match)") | Out-Null
    }
    $blogLines.Add("") | Out-Null
}
$blogLines.Add("## Next.js/API route-like files") | Out-Null
$routeMatches = @($script:FileRecords | Where-Object { $_.RelativePath -match "(^|[\\/])(app|pages)[\\/].*(page|layout|route)\.(tsx|ts|jsx|js|mdx)$" } | Sort-Object RelativePath)
if ($routeMatches.Count -gt 0) {
    foreach ($routeMatch in $routeMatches) {
        $blogLines.Add("- $($routeMatch.RelativePath)") | Out-Null
    }
}
else {
    $blogLines.Add("(no route-like files detected by common Next.js patterns)") | Out-Null
}
$blogLines.Add("") | Out-Null

$configLines = New-Object System.Collections.Generic.List[string]
$configLines.Add("PROJECT CONFIGURATION SUMMARY - shorakaei.ir") | Out-Null
$configLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')") | Out-Null
$configLines.Add("Project root: $ProjectRoot") | Out-Null
$configLines.Add("") | Out-Null
$configLines.Add("=== PACKAGE ===") | Out-Null
if ($null -ne $package) {
    $configLines.Add("package.json found: yes") | Out-Null
    $configLines.Add("name: $([string]$package.name)") | Out-Null
    $configLines.Add("version: $([string]$package.version)") | Out-Null
    $configLines.Add("private: $([string]$package.private)") | Out-Null
}
else {
    $configLines.Add("package.json found: no") | Out-Null
}
$configLines.Add("Lock files: $(if ($lockFiles.Count -gt 0) { $lockFiles -join ', ' } else { 'none detected' })") | Out-Null
$configLines.Add("") | Out-Null
$configLines.Add("=== PACKAGE SCRIPTS ===") | Out-Null
if ($null -ne $package -and $null -ne $package.scripts) {
    foreach ($property in $package.scripts.PSObject.Properties) {
        $safeCommand = Get-RedactedText -Text ([string]$property.Value)
        $configLines.Add("$($property.Name): $safeCommand") | Out-Null
    }
}
else {
    $configLines.Add("(no package scripts detected)") | Out-Null
}
$configLines.Add("") | Out-Null
$configLines.Add("=== DEPENDENCIES ===") | Out-Null
if ($packageDeps.Count -gt 0) {
    foreach ($sectionName in @("dependencies", "devDependencies", "peerDependencies", "optionalDependencies")) {
        $sectionDeps = @($packageDeps | Where-Object { $_.Section -eq $sectionName } | Sort-Object Name)
        if ($sectionDeps.Count -gt 0) {
            $configLines.Add("[$sectionName]") | Out-Null
            foreach ($dep in $sectionDeps) {
                $configLines.Add("- $($dep.Name): $($dep.Version)") | Out-Null
            }
        }
    }
}
else {
    $configLines.Add("(no dependencies detected)") | Out-Null
}
$configLines.Add("") | Out-Null
$configLines.Add("=== ENV FILE VARIABLE NAMES ONLY ===") | Out-Null
$configLines.Add("Values are intentionally not read, copied, or reported.") | Out-Null
if ($envSummary.Count -gt 0) {
    foreach ($envLine in $envSummary) {
        $configLines.Add("- $envLine") | Out-Null
    }
}
else {
    $configLines.Add("(no .env-like files detected by name)") | Out-Null
}
$configLines.Add("") | Out-Null
$configLines.Add("=== DETECTED HINTS ===") | Out-Null
$configLines.Add("Frameworks/build tools: $($frameworkList -join ', ')") | Out-Null
$configLines.Add("CSS hints: $($cssList -join ', ')") | Out-Null
$configLines.Add("CMS/database hints: $($dataList -join ', ')") | Out-Null
$configLines.Add("Test/lint hints: $($testList -join ', ')") | Out-Null
$configLines.Add("TypeScript files: $($tsFiles.Count)") | Out-Null
$configLines.Add("Font files: $($fontFiles.Count)") | Out-Null
$configLines.Add("Config files detected: $(if ($configFiles.Count -gt 0) { $configFiles -join ', ' } else { 'none by name' })") | Out-Null

$warningLines = New-Object System.Collections.Generic.List[string]
$warningLines.Add("AUDIT WARNINGS AND LIMITATIONS - shorakaei.ir") | Out-Null
$warningLines.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')") | Out-Null
$warningLines.Add("") | Out-Null
$warningLines.Add("The script did not run build, type-check, lint, tests, browser checks, accessibility checks, SEO validation, or deployment.") | Out-Null
$warningLines.Add("The script did not modify source files.") | Out-Null
$warningLines.Add("Generated and dependency directories were excluded: $($script:ExcludedDirNames -join ', ')") | Out-Null
$warningLines.Add("Directories matching '$($script:ExcludedDirRegex)' were also excluded.") | Out-Null
$warningLines.Add("") | Out-Null
if ($script:Warnings.Count -gt 0) {
    foreach ($warning in $script:Warnings) {
        $warningLines.Add("- $warning") | Out-Null
    }
}
else {
    $warningLines.Add("(no additional warnings)") | Out-Null
}

$auditPath = Join-Path $OutputRoot "project-audit.txt"
$treePath = Join-Path $OutputRoot "project-tree.txt"
$blogMapPath = Join-Path $OutputRoot "blog-file-map.txt"
$configSummaryPath = Join-Path $OutputRoot "project-config-summary.txt"
$warningsPath = Join-Path $OutputRoot "audit-warnings.txt"

Write-Utf8NoBom -Path $auditPath -Content (($auditLines -join [Environment]::NewLine) + [Environment]::NewLine)
Write-Utf8NoBom -Path $treePath -Content (($treeLines -join [Environment]::NewLine) + [Environment]::NewLine)
Write-Utf8NoBom -Path $blogMapPath -Content (($blogLines -join [Environment]::NewLine) + [Environment]::NewLine)
Write-Utf8NoBom -Path $configSummaryPath -Content (($configLines -join [Environment]::NewLine) + [Environment]::NewLine)
Write-Utf8NoBom -Path $warningsPath -Content (($warningLines -join [Environment]::NewLine) + [Environment]::NewLine)

$zipPath = $null
if (-not $SkipZip) {
    try {
        $compressCommand = Get-Command Compress-Archive -ErrorAction SilentlyContinue
        if ($null -ne $compressCommand) {
            $zipPath = Join-Path $OutputRoot "project-audit-reports.zip"
            $reportPaths = @($auditPath, $treePath, $blogMapPath, $configSummaryPath, $warningsPath)
            Compress-Archive -Path $reportPaths -DestinationPath $zipPath -Force -ErrorAction Stop
        }
        else {
            Add-Warning "Compress-Archive is not available; ZIP report was not created."
        }
    }
    catch {
        Add-Warning "ZIP creation failed: $($_.Exception.Message)"
        $zipPath = $null
    }
}

Write-Host ""
Write-Host "Inspection completed." -ForegroundColor Green
Write-Host "Reports written to:" -ForegroundColor Green
Write-Host "  $auditPath"
Write-Host "  $treePath"
Write-Host "  $blogMapPath"
Write-Host "  $configSummaryPath"
Write-Host "  $warningsPath"
if ($null -ne $zipPath -and (Test-Path -LiteralPath $zipPath)) {
    Write-Host "  $zipPath"
}
Write-Host ""
Write-Host "No source files were modified." -ForegroundColor Green