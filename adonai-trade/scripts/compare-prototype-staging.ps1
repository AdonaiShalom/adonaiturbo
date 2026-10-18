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
$indexCandidates = @(Get-ChildItem -LiteralPath $stageRoot -File -Recurse -Filter 'index.html' |
    Where-Object { $_.Directory.Name -ieq 'public' })
if ($indexCandidates.Count -gt 1) {
    throw "Staging contém mais de um public/index.html; a raiz do protótipo é ambígua. Nenhum arquivo foi alterado."
}
$prototypeRoot = if ($indexCandidates.Count -eq 1) {
    Split-Path -Parent (Split-Path -Parent $indexCandidates[0].FullName)
} else {
    $stageRoot
}

$sourceFiles = @(Get-ChildItem -LiteralPath $prototypeRoot -File -Recurse | Where-Object {
    $rel = $_.FullName.Substring($prototypeRoot.Length).TrimStart('\').Replace('\','/')
    $rel -notmatch '(?i)(^|/)(prototype-intake-report\.json|\.env|.*secret.*|.*credential.*)$'
})
$localFiles = @(Get-ChildItem -LiteralPath $localRoot -File -Recurse | Where-Object {
    $rel = $_.FullName.Substring($localRoot.Length).TrimStart('\').Replace('\','/')
    $rel -notmatch '(?i)(^|/)(\.env|.*secret.*|.*credential.*)$'
})
$rows = New-Object System.Collections.Generic.List[object]
$sourceRelPaths = @()

foreach ($source in $sourceFiles) {
    $rel = $source.FullName.Substring($prototypeRoot.Length).TrimStart('\')
    $normalized = $rel.Replace('\','/')
    $sourceRelPaths += $normalized
    $candidates = @($localFiles | Where-Object {
        $localRel = $_.FullName.Substring($localRoot.Length).TrimStart('\').Replace('\','/')
        $localRel.Equals($normalized, [System.StringComparison]::OrdinalIgnoreCase) -or
            $localRel.EndsWith('/' + $normalized, [System.StringComparison]::OrdinalIgnoreCase)
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

foreach ($localFile in $localFiles) {
    $localRel = $localFile.FullName.Substring($localRoot.Length).TrimStart('\')
    $normalizedLocal = $localRel.Replace('\','/')
    $covered = @($sourceRelPaths | Where-Object {
        $normalizedLocal.Equals($_, [System.StringComparison]::OrdinalIgnoreCase) -or
            $normalizedLocal.EndsWith('/' + $_, [System.StringComparison]::OrdinalIgnoreCase)
    }).Count -gt 0
    if (-not $covered) {
        $rows.Add([pscustomobject]@{
            status = 'ONLY_IN_LOCAL'
            prototype_path = ''
            local_path = $localRel
            prototype_sha256 = ''
            local_sha256 = (Get-FileHash -LiteralPath $localFile.FullName -Algorithm SHA256).Hash
        })
    }
}

$rows = @($rows | Sort-Object status, prototype_path, local_path)
$summary = [pscustomobject]@{
    stage_path = $stageRoot
    prototype_root = $prototypeRoot
    local_project_path = $localRoot
    files_in_prototype = $sourceFiles.Count
    files_in_local = $localFiles.Count
    identical = @($rows | Where-Object status -eq 'IDENTICAL').Count
    different = @($rows | Where-Object status -eq 'DIFFERENT').Count
    only_in_prototype = @($rows | Where-Object status -eq 'ONLY_IN_PROTOTYPE').Count
    only_in_local = @($rows | Where-Object status -eq 'ONLY_IN_LOCAL').Count
    ambiguous_local_match = @($rows | Where-Object status -eq 'AMBIGUOUS_LOCAL_MATCH').Count
    production_files_changed = $false
    matches = $rows
}
if (-not $ReportPath) {
    $ReportPath = Join-Path $env:TEMP ("AdonaiTrade-prototype-diff-" + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.json')
}
$summary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $ReportPath -Encoding UTF8

Write-Host '=== COMPARAÇÃO SOMENTE LEITURA CONCLUÍDA ===' -ForegroundColor Cyan
Write-Host ("Raiz do protótipo: " + $prototypeRoot)
Write-Host ("Arquivos no protótipo: " + $summary.files_in_prototype)
Write-Host ("Arquivos locais: " + $summary.files_in_local)
Write-Host ("Idênticos: " + $summary.identical)
Write-Host ("Diferentes: " + $summary.different)
Write-Host ("Só no protótipo: " + $summary.only_in_prototype)
Write-Host ("Só na instalação local: " + $summary.only_in_local)
Write-Host ("Correspondências ambíguas: " + $summary.ambiguous_local_match)
Write-Host ("Relatório: " + $ReportPath)
Write-Host 'Nenhum arquivo de produção foi alterado.' -ForegroundColor Yellow
$rows | Select-Object status, prototype_path, local_path | Format-Table -AutoSize
