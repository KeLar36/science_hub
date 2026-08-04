# count-lines.ps1 — Вирахування рядків коду у /client та /server

$clientPath = Join-Path $PSScriptRoot "client"
$serverPath = Join-Path $PSScriptRoot "server"

function Get-CodeStats ($path, $extensions, $label) {
    if (-not (Test-Path $path)) {
        return [PSCustomObject]@{
            Directory = $label
            Files     = 0
            Total     = 0
            Blank     = 0
            Code      = 0
        }
    }

    $files = Get-ChildItem -Path $path -Recurse -File -Include $extensions | 
        Where-Object { $_.FullName -notmatch '[\\/](node_modules|dist|build|\.git|\.next)[\\/]' }

    $totalLines = 0
    $emptyLines = 0

    foreach ($file in $files) {
        $lines = Get-Content $file.FullName
        if ($lines) {
            $totalLines += $lines.Count
            $emptyLines += ($lines | Where-Object { $_.Trim() -eq "" }).Count
        }
    }

    $codeLines = $totalLines - $emptyLines

    return [PSCustomObject]@{
        Directory = $label
        Files     = $files.Count
        Total     = $totalLines
        Blank     = $emptyLines
        Code      = $codeLines
    }
}

$results = @(
    Get-CodeStats -path $clientPath -extensions "*.jsx" -label "client (.jsx)"
    Get-CodeStats -path $serverPath -extensions "*.js"  -label "server (.js)"
)

Write-Host ""
Write-Host "--- STATS ---" -ForegroundColor Purple
$results | Format-Table -AutoSize