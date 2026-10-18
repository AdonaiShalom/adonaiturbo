[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$intakeScript = Join-Path $PSScriptRoot '..\..\scripts\prepare-prototype-intake.ps1'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('adonai-trade-intake-test-' + [guid]::NewGuid().ToString('N'))
$zipPath = Join-Path $tempRoot 'valid-prototype.zip'
$stageRoot = Join-Path $tempRoot 'staging'
New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

try {
    $archive = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        $files = @{
            'AdonaiTrade/public/index.html' = '<!doctype html><title>Prototype</title>'
            'AdonaiTrade/public/teia3d.js' = '/* prototype teia */'
            'AdonaiTrade/public/sede3d.html' = '<!doctype html><title>Sede 3D</title>'
            'AdonaiTrade/server.js' = "'use strict';"
            'AdonaiTrade/package.json' = '{"name":"prototype"}'
            'AdonaiTrade/README.md' = 'prototype intake test'
            'AdonaiTrade/test/a.js' = 'a'
            'AdonaiTrade/test/b.js' = 'b'
            'AdonaiTrade/test/c.js' = 'c'
            'AdonaiTrade/test/d.js' = 'd'
        }
        foreach ($item in $files.GetEnumerator()) {
            $entry = $archive.CreateEntry($item.Key)
            $stream = $entry.Open()
            try {
                $bytes = [System.Text.Encoding]::UTF8.GetBytes([string]$item.Value)
                $stream.Write($bytes, 0, $bytes.Length)
            } finally { $stream.Dispose() }
        }
    } finally { $archive.Dispose() }

    $hash = (Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash
    & $intakeScript -ZipPath $zipPath -StageRoot $stageRoot -ExpectedSha256 $hash
    $reports = @(Get-ChildItem -LiteralPath $stageRoot -Filter 'prototype-intake-report.json' -Recurse -File)
    if ($reports.Count -ne 1) { throw "Expected one intake report, got $($reports.Count)" }
    $report = Get-Content -LiteralPath $reports[0].FullName -Raw | ConvertFrom-Json
    if ($report.sha256 -ne $hash) { throw 'Intake report hash does not match the archive.' }
    if ($report.production_files_changed -ne $false) { throw 'Intake must not modify production.' }
    if ($report.entries -ne 10) { throw "Expected 10 archive entries, got $($report.entries)" }
    if (-not (Test-Path -LiteralPath (Join-Path $reports[0].DirectoryName 'AdonaiTrade\public\index.html'))) {
        throw 'Expected prototype index to be extracted under staging.'
    }
    Write-Host 'PASS: prototype intake validates SHA-256 and required files, extracts only to staging, and records production_files_changed=false.'
} finally {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}
