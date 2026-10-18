[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$scriptPath = Join-Path $PSScriptRoot '..\..\scripts\compare-prototype-staging.ps1'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('adonai-trade-prototype-diff-test-' + [guid]::NewGuid().ToString('N'))
$stage = Join-Path $tempRoot 'stage'
$prototypeRoot = Join-Path $stage 'package\AdonaiTrade'
$local = Join-Path $tempRoot 'local'
$report = Join-Path $tempRoot 'report.json'
New-Item -ItemType Directory -Path $stage -Force | Out-Null
New-Item -ItemType Directory -Path $local -Force | Out-Null
try {
    New-Item -ItemType Directory -Path (Join-Path $prototypeRoot 'public') -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $local 'public') -Force | Out-Null
    Set-Content -LiteralPath (Join-Path $prototypeRoot 'public\index.html') -Value '<html></html>' -NoNewline
    Set-Content -LiteralPath (Join-Path $local 'public\index.html') -Value '<html></html>' -NoNewline
    Set-Content -LiteralPath (Join-Path $prototypeRoot 'public\identical.txt') -Value 'same' -NoNewline
    Set-Content -LiteralPath (Join-Path $local 'public\identical.txt') -Value 'same' -NoNewline
    Set-Content -LiteralPath (Join-Path $prototypeRoot 'public\different.txt') -Value 'prototype' -NoNewline
    Set-Content -LiteralPath (Join-Path $local 'public\different.txt') -Value 'local' -NoNewline
    Set-Content -LiteralPath (Join-Path $local 'public\only-local-file.txt') -Value 'local-only' -NoNewline
    Set-Content -LiteralPath (Join-Path $prototypeRoot 'public\new-prototype-file.txt') -Value 'new' -NoNewline
    New-Item -ItemType Directory -Path (Join-Path $local 'duplicate-a\public') -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $local 'duplicate-b\public') -Force | Out-Null
    Set-Content -LiteralPath (Join-Path $prototypeRoot 'public\ambiguous.txt') -Value 'ambiguous' -NoNewline
    Set-Content -LiteralPath (Join-Path $local 'duplicate-a\public\ambiguous.txt') -Value 'a' -NoNewline
    Set-Content -LiteralPath (Join-Path $local 'duplicate-b\public\ambiguous.txt') -Value 'b' -NoNewline

    & $scriptPath -StagePath $stage -LocalProjectPath $local -ReportPath $report | Out-Null
    $result = Get-Content -LiteralPath $report -Raw | ConvertFrom-Json
    if ($result.identical -ne 1) { throw "Expected identical=1, got $($result.identical)" }
    if ($result.different -ne 1) { throw "Expected different=1, got $($result.different)" }
    if ($result.only_in_prototype -ne 1) { throw "Expected only_in_prototype=1, got $($result.only_in_prototype)" }
    if ($result.ambiguous_local_match -ne 1) { throw "Expected ambiguous_local_match=1, got $($result.ambiguous_local_match)" }
    if ($result.only_in_local -lt 1) { throw 'Expected at least one local-only file to be reported.' }
    if (-not $result.prototype_root.EndsWith('package\AdonaiTrade')) { throw "Expected detected project root, got $($result.prototype_root)" }
    if ($result.production_files_changed -ne $false) { throw 'Comparison must declare production_files_changed=false.' }
    Write-Host 'PASS: prototype diff identifies identical, different, prototype-only, local-only, detected root, and ambiguous files without modifying production.'
}
finally {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}
