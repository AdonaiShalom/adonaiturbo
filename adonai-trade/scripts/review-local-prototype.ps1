[CmdletBinding()]
param(
    [string]$ZipPath = (Join-Path $env:USERPROFILE 'Downloads\AdonaiTrade_COMPLETO.zip'),
    [string]$LocalProjectPath = 'C:\AdonaiTurbo\AdonaiTrade',
    [string]$ExpectedSha256 = '573AFEF41813311C4411B943802F649D0A66ABB9C5771C3DCC7E485CDEFE343C',
    [string]$ReportPath = ''
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Stop-Safely([string]$Message) {
    Write-Host ("BLOQUEADO: " + $Message) -ForegroundColor Yellow
    Write-Host 'Nenhum arquivo de produção foi alterado.' -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path -LiteralPath $ZipPath -PathType Leaf)) {
    Stop-Safely "ZIP não encontrado: $ZipPath"
}
if (-not (Test-Path -LiteralPath $LocalProjectPath -PathType Container)) {
    Stop-Safely "Projeto local não encontrado: $LocalProjectPath"
}

$scriptRoot = $PSScriptRoot
$intakeScript = Join-Path $scriptRoot 'prepare-prototype-intake.ps1'
$compareScript = Join-Path $scriptRoot 'compare-prototype-staging.ps1'
foreach ($script in @($intakeScript, $compareScript)) {
    if (-not (Test-Path -LiteralPath $script -PathType Leaf)) {
        Stop-Safely "Script necessário não encontrado: $script"
    }
}

$actualHash = (Get-FileHash -LiteralPath $ZipPath -Algorithm SHA256).Hash.ToUpperInvariant()
if ($actualHash -ne $ExpectedSha256.ToUpperInvariant()) {
    Stop-Safely "SHA-256 divergente. Esperado=$ExpectedSha256; obtido=$actualHash"
}

$stageBase = Join-Path $env:TEMP 'AdonaiTrade-prototype-intake'
& $intakeScript -ZipPath $ZipPath -StageRoot $stageBase -ExpectedSha256 $ExpectedSha256
if (-not $?) { Stop-Safely 'A preparação do ZIP falhou.' }

$reports = @(Get-ChildItem -LiteralPath $stageBase -Filter 'prototype-intake-report.json' -Recurse -File |
    Where-Object { $_.Directory.Name -like 'intake-*' } |
    Sort-Object LastWriteTimeUtc -Descending)
if ($reports.Count -eq 0) {
    Stop-Safely "O intake não produziu manifesto em $stageBase"
}
$manifest = Get-Content -LiteralPath $reports[0].FullName -Raw | ConvertFrom-Json
if ($manifest.sha256 -ne $actualHash -or $manifest.production_files_changed -ne $false) {
    Stop-Safely 'O manifesto não corresponde ao ZIP verificado ou não confirma produção intacta.'
}
$stagePath = $reports[0].Directory.FullName
if (-not $ReportPath) {
    $ReportPath = Join-Path $env:TEMP ("AdonaiTrade-prototype-review-" + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.json')
}
& $compareScript -StagePath $stagePath -LocalProjectPath $LocalProjectPath -ReportPath $ReportPath
if (-not $?) { Stop-Safely 'A comparação somente leitura falhou.' }

Write-Host ''
Write-Host '=== GATE DE REVISÃO CONCLUÍDO ===' -ForegroundColor Cyan
Write-Host ("ZIP verificado: " + $ZipPath)
Write-Host ("SHA-256: " + $actualHash)
Write-Host ("Staging: " + $stagePath)
Write-Host ("Relatório comparativo: " + $ReportPath)
Write-Host 'A comparação é somente leitura. Nenhum arquivo de produção foi copiado, substituído ou apagado.' -ForegroundColor Yellow
Write-Host 'Próximo gate: revisar diferenças e definir integração específica na aba existente antes de qualquer alteração de produção.' -ForegroundColor Yellow
