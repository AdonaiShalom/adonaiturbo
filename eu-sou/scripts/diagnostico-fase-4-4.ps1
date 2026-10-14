# EU SOU — diagnóstico somente de leitura da Fase 4.4
# Executar no Windows PowerShell. Não altera ficheiros, índices ou serviços.
$ErrorActionPreference = 'Continue'
$raiz = 'C:\AdonaiTurbo'
$biblioteca = Join-Path $raiz 'frontend\eu-sou-completo\biblioteca-local'
$backup = 'C:\AdonaiDados\EU_SOU\backups\CONTINUIDADE_EU_SOU_FASE4_2026-10-13.txt'
$baseUrl = 'http://127.0.0.1:8765/'

Write-Host '
=== 1. PASTAS E BACKUP ===' -ForegroundColor Cyan
[pscustomobject]@{Caminho=$biblioteca; Existe=(Test-Path -LiteralPath $biblioteca)}
[pscustomobject]@{Caminho=$backup; Existe=(Test-Path -LiteralPath $backup)}
if (Test-Path -LiteralPath $backup) {
  Get-Item -LiteralPath $backup | Select-Object FullName,Length,LastWriteTime
}

Write-Host '
=== 2. ÍNDICES E FICHEIROS CANDIDATOS (máx. 30) ===' -ForegroundColor Cyan
if (Test-Path -LiteralPath $biblioteca) {
  Get-ChildItem -LiteralPath $biblioteca -File -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match 'index|manifest|metadata|chunk|document|catalog|sqlite|jsonl|json|db$' } |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 30 FullName,Length,LastWriteTime
} else {
  Write-Host 'Biblioteca não encontrada no caminho esperado.'
}

Write-Host '
=== 3. PORTA 8765 ===' -ForegroundColor Cyan
$tcp = Test-NetConnection -ComputerName '127.0.0.1' -Port 8765 -WarningAction SilentlyContinue
[pscustomobject]@{Host='127.0.0.1';Port=8765;TcpDisponivel=$tcp.TcpTestSucceeded}

Write-Host '
=== 4. RESPOSTA HTTP DA RAIZ (GET, sem alterações) ===' -ForegroundColor Cyan
try {
  $r = Invoke-WebRequest -Uri $baseUrl -Method Get -TimeoutSec 5 -UseBasicParsing
  [pscustomobject]@{Url=$baseUrl;StatusCode=[int]$r.StatusCode;ContentType=$r.Headers['Content-Type'];TamanhoCorpo=([string]$r.Content).Length}
} catch {
  $status = $null
  if ($_.Exception.Response) { try { $status = [int]$_.Exception.Response.StatusCode } catch {} }
  [pscustomobject]@{Url=$baseUrl;StatusCode=$status;Erro=$_.Exception.Message}
}

Write-Host '
=== 5. HASHES DOS 10 FICHEIROS MAIS RECENTES (se existirem) ===' -ForegroundColor Cyan
if (Test-Path -LiteralPath $biblioteca) {
  Get-ChildItem -LiteralPath $biblioteca -File -Recurse -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 10 |
    ForEach-Object {
      $h = Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256
      [pscustomobject]@{Ficheiro=$_.FullName;Bytes=$_.Length;SHA256=$h.Hash}
    }
}

Write-Host '
=== FIM: diagnóstico apenas de leitura; nenhum ficheiro foi alterado ===' -ForegroundColor Green
