# LEVI — diagnóstico local somente leitura (com cópia de segurança)
# Executar no PowerShell do Windows. Não imprime valores de .env nem modifica ficheiros-fonte.
$ErrorActionPreference = 'Stop'
$raiz = 'C:\AdonaiTurbo'
$base = 'C:\AdonaiDados\LEVI'
$backup = Join-Path $base 'backups'
$relatorio = Join-Path $base 'diagnostico_local.txt'
New-Item -ItemType Directory -Path $backup -Force | Out-Null

$ficheiros = @(
  'backend\server.js',
  'backend\levi-core.js',
  'backend\eu-sou-api.js',
  'package.json',
  'frontend\index.html'
)
$linhas = [System.Collections.Generic.List[string]]::new()
$linhas.Add('LEVI — diagnóstico local')
$linhas.Add(('Data: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')))
$linhas.Add(('Raiz: ' + $raiz))
$linhas.Add('Nota: valores de .env e segredos não são recolhidos.')
$linhas.Add('')

foreach ($rel in $ficheiros) {
  $origem = Join-Path $raiz $rel
  $linhas.Add(('=== ' + $rel + ' ==='))
  if (Test-Path -LiteralPath $origem -PathType Leaf) {
    $item = Get-Item -LiteralPath $origem
    $linhas.Add(('Encontrado: sim | bytes: ' + $item.Length + ' | actualizado: ' + $item.LastWriteTime.ToString('s')))
    $destino = Join-Path $backup ($rel.Replace('\','__') + '.bak')
    Copy-Item -LiteralPath $origem -Destination $destino -Force
    $linhas.Add(('Backup: ' + $destino))
    if ($rel -ne 'frontend\index.html') {
      $texto = Get-Content -LiteralPath $origem -Raw -Encoding UTF8
      $padroes = @('app\.(get|post|put|delete|patch)\s*\(', 'eu-sou', 'anchor', 'supabase', 'motor:', 'system', 'prompt', 'timeout', 'AbortController', 'listen', 'speechSynthesis', 'require\(')
      foreach ($p in $padroes) {
        $m = Select-String -LiteralPath $origem -Pattern $p -AllMatches -ErrorAction SilentlyContinue
        if ($m) {
          foreach ($linha in ($m | Select-Object -First 8)) {
            $trecho = $linha.Line.Trim()
            if ($trecho.Length -gt 220) { $trecho = $trecho.Substring(0,220) + '…' }
            $linhas.Add(('{0}: {1}' -f $linha.LineNumber, $trecho))
          }
        }
      }
    } else {
      $m = Select-String -LiteralPath $origem -Pattern 'LEVI|levi|reinicioAgendado|speechSynthesis|no-speech|api/levi' -AllMatches -ErrorAction SilentlyContinue
      foreach ($linha in ($m | Select-Object -First 18)) {
        $trecho = $linha.Line.Trim()
        if ($trecho.Length -gt 220) { $trecho = $trecho.Substring(0,220) + '…' }
        $linhas.Add(('{0}: {1}' -f $linha.LineNumber, $trecho))
      }
    }
  } else {
    $linhas.Add('Encontrado: não')
  }
  $linhas.Add('')
}
$linhas.Add('=== Referências de âncora/LEVI no backend (sem ficheiros .env) ===')
$backend = Join-Path $raiz 'backend'
if (Test-Path -LiteralPath $backend) {
  $hits = Get-ChildItem -LiteralPath $backend -File -Include '*.js','*.json' -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -notmatch '\.env' } |
    Select-String -Pattern 'eu_sou_anchor|anchor_advance|anchor_read|api/levi/orquestrar|eu-sou/calcular' -ErrorAction SilentlyContinue |
    Select-Object -First 40
  foreach ($h in $hits) {
    $trecho = $h.Line.Trim()
    if ($trecho.Length -gt 220) { $trecho = $trecho.Substring(0,220) + '…' }
    $linhas.Add(('{0}:{1}: {2}' -f $h.Path, $h.LineNumber, $trecho))
  }
} else {
  $linhas.Add('Pasta backend não encontrada.')
}
$linhas | Set-Content -LiteralPath $relatorio -Encoding UTF8
Write-Host ''
Write-Host 'Diagnóstico LEVI concluído. Nenhum ficheiro-fonte foi alterado.' -ForegroundColor Green
Write-Host ('Relatório: ' + $relatorio)
Write-Host ('Backups:   ' + $backup)
Write-Host ''
Get-Content -LiteralPath $relatorio -Encoding UTF8
