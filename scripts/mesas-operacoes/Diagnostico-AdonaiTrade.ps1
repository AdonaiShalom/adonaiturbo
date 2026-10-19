[CmdletBinding()]
param([string]$ProjectRoot = 'C:\AdonaiTurbo\AdonaiTrade',[switch]$RunKnownUnitTests)
$ErrorActionPreference = 'Continue'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$reportDir = Join-Path $env:TEMP "AdonaiTrade-auditoria-$stamp"
New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
$reportFile = Join-Path $reportDir 'RELATORIO_DIAGNOSTICO.txt'
$lines = New-Object System.Collections.Generic.List[string]
function Add-Line([string]$Value) { $lines.Add($Value); Write-Host $Value }
Add-Line '=== ADONAI TRADE — DIAGNÓSTICO LOCAL SEGURO ==='
Add-Line ("Data local: " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'))
Add-Line ("Raiz solicitada: " + $ProjectRoot)
Add-Line 'Leitura do projeto; sem deploy, sem alterações no projeto e sem exibir segredos.'
Add-Line ''
if (-not (Test-Path -LiteralPath $ProjectRoot -PathType Container)) {
 Add-Line 'ERRO: pasta do projeto não encontrada.'
 $lines | Set-Content -LiteralPath $reportFile -Encoding UTF8
 Add-Line ("Relatório: " + $reportFile)
 exit 2
}
Set-Location -LiteralPath $ProjectRoot
Add-Line '--- 1. AMBIENTE ---'
Add-Line ("Node: " + $(if (Get-Command node.exe -ErrorAction SilentlyContinue) { (& node.exe --version 2>$null | Select-Object -First 1) } else { 'não encontrado' }))
Add-Line ("npm.cmd: " + $(if (Get-Command npm.cmd -ErrorAction SilentlyContinue) { (Get-Command npm.cmd).Source } else { 'não encontrado' }))
Add-Line ("Git: " + $(if (Get-Command git.exe -ErrorAction SilentlyContinue) { (& git.exe --version 2>$null | Select-Object -First 1) } else { 'não encontrado' }))
Add-Line ''
Add-Line '--- 2. GIT (SEM ALTERAR NADA) ---'
if (Get-Command git.exe -ErrorAction SilentlyContinue) {
 $gitRoot = & git.exe rev-parse --show-toplevel 2>$null
 if ($LASTEXITCODE -eq 0) {
  Add-Line ("Git root: " + $gitRoot)
  Add-Line ("Branch: " + (& git.exe branch --show-current 2>$null))
  $gitStatus = @(& git.exe status --short 2>$null)
  if ($gitStatus.Count -gt 0) { Add-Line 'Status:'; $gitStatus | ForEach-Object { Add-Line ("  " + $_) } } else { Add-Line 'Git status sem alterações reportadas.' }
 } else { Add-Line 'Pasta fora de um repositório Git.' }
} else { Add-Line 'Git não disponível.' }
Add-Line ''
Add-Line '--- 3. ARQUIVOS-CHAVE ---'
$relativeFiles = @('package.json','README.md','server.js','index.js','lib\rh.js','lib\macro_guard.js','lib\connectors.js','lib\integration.js','test\unit.js','test\unit_mesa.js','test\unit_equipes.js','test\smoke.js','test\forex.unit.js','test\forex-historico.unit.js','test\forex-api.unit.js','config\macro_guard.json')
foreach ($rel in $relativeFiles) {
 $path = Join-Path $ProjectRoot $rel
 if (Test-Path -LiteralPath $path -PathType Leaf) { $item = Get-Item -LiteralPath $path; Add-Line ("PRESENTE | {0} | {1} bytes" -f $rel,$item.Length) }
 else { Add-Line ("AUSENTE | {0}" -f $rel) }
}
Add-Line ''
Add-Line '--- 4. PACKAGE.JSON ---'
$packagePath = Join-Path $ProjectRoot 'package.json'
if (Test-Path -LiteralPath $packagePath) {
 try {
  $package = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
  Add-Line ("Nome/versão: {0} / {1}" -f $package.name,$package.version)
  Add-Line ("Node exigido: " + $(if ($package.engines.node) { $package.engines.node } else { '(não declarado)' }))
  if ($package.scripts) { $package.scripts.PSObject.Properties | ForEach-Object { Add-Line ("{0} = {1}" -f $_.Name,$_.Value) } } else { Add-Line 'Nenhum script declarado.' }
 } catch { Add-Line ('ERRO lendo package.json: ' + $_.Exception.Message) }
} else { Add-Line 'package.json não encontrado.' }
Add-Line ''
Add-Line '--- 5. INSPEÇÃO DO SMOKE (NÃO EXECUTA) ---'
$smokePath = Join-Path $ProjectRoot 'test\smoke.js'
if (Test-Path -LiteralPath $smokePath) {
 $smoke = Get-Content -LiteralPath $smokePath -Raw
 foreach ($pattern in @('rmSync','unlinkSync','rmdirSync','writeFileSync','renameSync','emptyDir','removeSync','delete','data[/\\]')) {
  $count = [regex]::Matches($smoke,$pattern,[System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Count
  if ($count -gt 0) { Add-Line ("ATENÇÃO: termo '{0}' aparece {1} vez(es); revisar contexto." -f $pattern,$count) }
 }
 Add-Line 'Smoke não foi executado.'
} else { Add-Line 'test\smoke.js não encontrado.' }
Add-Line ''
Add-Line '--- 6. PORTAS LOCAIS ---'
try {
 $connections = @(Get-NetTCPConnection -State Listen -ErrorAction Stop | Where-Object { $_.LocalPort -in @(3000,3001,3002,3100) } | Sort-Object LocalPort -Unique)
 if ($connections.Count -gt 0) { foreach ($conn in $connections) { Add-Line ("LISTEN | 127.0.0.1:{0} | PID {1}" -f $conn.LocalPort,$conn.OwningProcess) } }
 else { Add-Line 'Nenhuma das portas 3000, 3001, 3002 ou 3100 está em LISTEN.' }
} catch { Add-Line 'Portas não verificadas (Get-NetTCPConnection indisponível).' }
Add-Line 'Portas abertas não comprovam saúde da API.'
Add-Line ''
Add-Line '--- 7. ARQUIVOS DE AMBIENTE (VALORES OMITIDOS) ---'
foreach ($envName in @('.env','.env.local','.env.production')) {
 $envPath = Join-Path $ProjectRoot $envName
 if (Test-Path -LiteralPath $envPath -PathType Leaf) {
  Add-Line ("Arquivo presente: {0}; conteúdo omitido." -f $envName)
  $keys = @(Get-Content -LiteralPath $envPath | Where-Object { $_ -match '^\s*[A-Za-z_][A-Za-z0-9_]*\s*=' } | ForEach-Object { ($_ -split '=',2)[0].Trim() } | Sort-Object -Unique)
  foreach ($key in $keys) { Add-Line ("  variável: " + $key) }
 }
}
Add-Line 'Nenhum valor de variável foi escrito no relatório.'
Add-Line ''
if ($RunKnownUnitTests) {
 Add-Line '--- 8. TESTES UNITÁRIOS SELECIONADOS ---'
 Add-Line 'Executa somente testes listados; test\smoke.js está excluído.'
 if (-not (Get-Command node.exe -ErrorAction SilentlyContinue)) { Add-Line 'TESTES NÃO EXECUTADOS: Node.js não encontrado.' }
 else {
  foreach ($testRel in @('test\unit.js','test\unit_mesa.js','test\unit_equipes.js','test\forex.unit.js')) {
   $testPath = Join-Path $ProjectRoot $testRel
   if (Test-Path -LiteralPath $testPath -PathType Leaf) {
    Add-Line ("EXECUTANDO: node {0}" -f $testRel)
    $output = & node.exe $testPath 2>&1
    $exitCode = $LASTEXITCODE
    foreach ($outLine in $output) { Add-Line ([string]$outLine) }
    Add-Line ("RESULTADO: {0}; exit code {1}" -f $(if ($exitCode -eq 0) {'PASSOU'} else {'FALHOU'}),$exitCode)
   } else { Add-Line ("PULADO: {0} não existe." -f $testRel) }
  }
 }
} else { Add-Line '--- 8. TESTES ---'; Add-Line 'Nenhum teste executado; revise o inventário e o smoke antes de rodar testes.' }
Add-Line ''
Add-Line '=== FIM DO DIAGNÓSTICO ==='
$lines | Set-Content -LiteralPath $reportFile -Encoding UTF8
Write-Host ''
Write-Host ("Relatório salvo em: " + $reportFile) -ForegroundColor Green
Write-Host 'Não houve publicação, deploy nem alteração nos arquivos do projeto.'
