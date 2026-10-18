[CmdletBinding()]
param(
    [string]$ZipPath = (Join-Path $env:USERPROFILE 'Downloads\AdonaiTrade_COMPLETO.zip'),
    [string]$StageRoot = (Join-Path $env:TEMP 'AdonaiTrade-prototype-intake'),
    [string]$ExpectedSha256 = '573AFEF41813311C4411B943802F649D0A66ABB9C5771C3DCC7E485CDEFE343C'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Write-Fail([string]$Message) {
    Write-Host ("FALHA: " + $Message) -ForegroundColor Red
    exit 1
}

if (-not (Test-Path -LiteralPath $ZipPath -PathType Leaf)) {
    Write-Fail "ZIP principal não encontrado: $ZipPath. Nenhum arquivo do projeto foi alterado."
}
$resolvedZip = (Resolve-Path -LiteralPath $ZipPath).Path
$hash = (Get-FileHash -LiteralPath $resolvedZip -Algorithm SHA256).Hash.ToUpperInvariant()
if ($ExpectedSha256 -and $hash -ne $ExpectedSha256.ToUpperInvariant()) {
    Write-Fail "SHA-256 diferente do ZIP de referência. Obtido=$hash. Nenhuma extração foi feita."
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($resolvedZip)
try {
    $entries = @($archive.Entries | ForEach-Object { $_.FullName })
    if ($entries.Count -lt 10) { Write-Fail "ZIP parece incompleto (menos de 10 entradas)." }
    if ($entries.Count -gt 5000) { Write-Fail "ZIP excede o limite de 5000 entradas. Nenhuma extração foi feita." }
    $maxEntryBytes = 50MB
    $maxTotalBytes = 250MB
    $totalUncompressedBytes = [int64]0

    foreach ($entry in $archive.Entries) {
        if ($entry.Length -gt $maxEntryBytes) { Write-Fail "Arquivo no ZIP excede 50 MiB: $($entry.FullName)" }
        $totalUncompressedBytes += [int64]$entry.Length
        if ($totalUncompressedBytes -gt $maxTotalBytes) { Write-Fail 'Conteúdo descompactado excede 250 MiB. Nenhuma extração foi feita.' }
        $normalized = $entry.FullName.Replace('\','/')
        if ($normalized.StartsWith('/') -or $normalized -match '(^|/)\.\.(/|$)' -or $normalized -match '^[A-Za-z]:') {
            Write-Fail "Caminho inseguro no ZIP: $($entry.FullName)"
        }
    }

    $matches = @($entries | Where-Object {
        $_ -match '(?i)(prototipo.*\.html|sede3d\.html|teia3d\.js|(^|/)public/index\.html$|(^|/)server\.js$|(^|/)package\.json$)'
    })
    if (-not ($entries | Where-Object { $_ -match '(?i)sede3d\.html' })) {
        Write-Fail "Não encontrei sede3d.html no ZIP principal. Não vou substituir a interface por outro protótipo."
    }
    if (-not ($entries | Where-Object { $_ -match '(?i)teia3d\.js' })) {
        Write-Fail "Não encontrei teia3d.js no ZIP principal."
    }
    if (-not ($entries | Where-Object { $_ -match '(?i)(^|/)public/index\.html$' })) {
        Write-Fail "Não encontrei public/index.html no ZIP principal. Não vou integrar uma interface incompleta."
    }
    $prototypeHtml = @($entries | Where-Object { $_ -match '(?i)prototipo.*\.html|sede3d\.html' })
    if ($prototypeHtml.Count -eq 0) { Write-Fail 'Nenhum HTML de protótipo foi encontrado.' }
    $entryCount = $entries.Count
}
finally {
    $archive.Dispose()
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$stage = Join-Path $StageRoot ("intake-" + $stamp)
New-Item -ItemType Directory -Path $stage -Force | Out-Null
try {
    [System.IO.Compression.ZipFile]::ExtractToDirectory($resolvedZip, $stage)
}
catch {
    Remove-Item -LiteralPath $stage -Recurse -Force -ErrorAction SilentlyContinue
    Write-Fail ("Extração de staging falhou: " + $_.Exception.Message)
}

$manifest = [pscustomobject]@{
    source_zip = $resolvedZip
    sha256 = $hash
    entries = $entryCount
    extracted_to_staging = $true
    production_files_changed = $false
    prototype_html = $prototypeHtml
    relevant_files = $matches
    next_gate = 'Comparar o protótipo extraído com C:\AdonaiTurbo\AdonaiTrade; não copiar para produção automaticamente.'
}
$reportPath = Join-Path $stage 'prototype-intake-report.json'
$manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $reportPath -Encoding UTF8

Write-Host '=== PROTÓTIPO VALIDADO E EXTRAÍDO EM STAGING ===' -ForegroundColor Green
Write-Host ("SHA-256: " + $hash)
Write-Host ("Entradas: " + $entryCount)
Write-Host ("Staging: " + $stage)
Write-Host ("Relatório: " + $reportPath)
Write-Host 'Nenhum arquivo de produção foi alterado.' -ForegroundColor Yellow
Write-Host 'Arquivos relevantes:'
$matches | Sort-Object -Unique | ForEach-Object { Write-Host (" - " + $_) }
