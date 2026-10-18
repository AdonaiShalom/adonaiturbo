[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$StagePath,
    [string]$LocalProjectPath = 'C:\AdonaiTurbo\AdonaiTrade',
    [string]$ReportPath = ''
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if (-not (Test-Path -LiteralPath $StagePath -PathType Container)) {
    throw "Staging não encontrado: $StagePath"
}
if (-not (Test-Path -LiteralPath $LocalProjectPath -PathType Container)) {
    throw "Projeto local não encontrado: $LocalProjectPath. Nenhum arquivo foi alterado."
}

$stageRoot = (Resolve-Path -LiteralPath $StagePath).Path.TrimEnd('\')
$localRoot = (Resolve-Path -LiteralPath $LocalProjectPath).Path.TrimEnd('\')
$sourceFiles = @(Get-ChildItem -LiteralPath $stageRoot -File -Recurse)
$localFiles = @(Get-ChildItem -LiteralPath $localRoot -File -Recurse)
$rows = New-Object System.Collections.Generic.List[object]

foreach ($source in $sourceFiles) {
    $rel = $source.FullName.Substring($stageRoot.Length).TrimStart('\')
    $normalized = $rel.Replace('\','/')
    if ($normalized -match '(?i)(^|/)(prototype-intake-report\.json|\.env|.*secret.*|.*credential.*)$') { continue }

    $candidates = @($localFiles | Where-Object {
        $_.FullName.Substring($localRoot.Length).TrimStart('\').Replace('\','/').EndsWith($normalized, [System.StringComparison]::OrdinalIgnoreCase)
    })
    $sourceHash = (Get-FileHash -LiteralPath $source.FullName -Algorithm SHA256).Hash
    if ($candidates.Count -eq 0) {
        $status = 'ONLY_IN_PROTOTYPE'
        $targetRel = ''
        $targetHash = ''
    } elseif ($candidates.Count -gt 1) {
        $status = 'AMBIGUOUS_LOCAL_MATCH'
        $targetRel = ($candidates | ForEach-Object { $_.FullName.Substring($localRoot.Length).TrimStart('\') }) -join '; '
        $targetHash = ''
    } else {
        $targetRel = $candidates[0].FullName.Substring($localRoot.Length).TrimStart('\')
        $targetHash = (Get-FileHash -LiteralPath $candidates[0].FullName -Algorithm SHA256).Hash
        $status = if ($sourceHash -eq $targetHash) { 'IDENTICAL' } else { 'DIFFERENT' }
    }
    $rows.Add([pscustomobject]@{
        status = $status
        prototype_path = $rel
        local_path = $targetRel
        prototype_sha256 = $sourceHash
        local_sha256 = $targetHash
    })
}

$localRelative = @($localFiles | ForEach-Object { $_.FullName.Substring($localRoot.Length).TrimStart('\').Replace('\','/') })
$rows = @($rows | Sort-Object status, prototype_path)
$summary = [pscustomobject]@{
    stage_path = $stageRoot
    local_project_path = $localRoot
    files_in_prototype = $sourceFiles.Count
    identical = @($rows | Where-Object status -eq 'IDENTICAL').Count
    different = @($rows | Where-Object status -eq 'DIFFERENT').Count
    only_in_prototype = @($rows | Where-Object status -eq 'ONLY_IN_PROTOTYPE').Count
    ambiguous_local_match = @($rows | Where-Object status -eq 'AMBIGUOUS_LOCAL_MATCH').Count
    production_files_changed = $false
    matches = $rows
}
if (-not $ReportPath) {
    $ReportPath = Join-Path $env:TEMP ("AdonaiTrade-prototype-diff-" + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.json')
}
$summary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $ReportPath -Encoding UTF8

Write-Host '=== COMPARAÇÃO SOMENTE LEITURA CONCLUÍDA ===' -ForegroundColor Cyan
Write-Host ("Arquivos no protótipo: " + $summary.files_in_prototype)
Write-Host ("Idênticos: " + $summary.identical)
Write-Host ("Diferentes: " + $summary.different)
Write-Host ("Só no protótipo: " + $summary.only_in_prototype)
Write-Host ("Correspondências ambíguas: " + $summary.ambiguous_local_match)
Write-Host ("Relatório: " + $ReportPath)
Write-Host 'Nenhum arquivo de produção foi alterado.' -ForegroundColor Yellow
$rows | Select-Object status, prototype_path, local_path | Format-Table -AutoSize
