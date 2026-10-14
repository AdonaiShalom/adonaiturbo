$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$checks = @(
    @{ Name = 'Busca local EU SOU :8765'; Url = 'http://127.0.0.1:8765/search?q=pontos%20quanticos%20nanofios&k=5'; Method = 'GET'; Body = $null },
    @{ Name = 'Saude Adonai Turbo :3000'; Url = 'http://127.0.0.1:3000/api/health'; Method = 'GET'; Body = $null },
    @{ Name = 'LEVI orquestracao :3000'; Url = 'http://127.0.0.1:3000/api/levi/orquestrar'; Method = 'POST'; Body = (@{ mensagem = 'Diagnostico EU SOU: responda apenas TESTE_OK e informe se recebeu contexto cientifico.' } | ConvertTo-Json -Compress) }
)

Write-Host '=== DIAGNOSTICO LOCAL EU SOU / LEVI ===' -ForegroundColor Cyan
Write-Host ('Data: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'))
Write-Host 'Este script apenas consulta endpoints; nao altera arquivos nem banco.'

foreach ($check in $checks) {
    Write-Host ('--- ' + $check.Name + ' ---') -ForegroundColor Yellow
    try {
        $params = @{ Uri = $check.Url; Method = $check.Method; TimeoutSec = 8; ErrorAction = 'Stop' }
        if ($check.Body) { $params.Body = $check.Body; $params.ContentType = 'application/json; charset=utf-8' }
        $response = Invoke-WebRequest @params
        Write-Host ('HTTP: ' + [int]$response.StatusCode)
        $body = [string]$response.Content
        if ($body.Length -gt 1800) { $body = $body.Substring(0, 1800) + '...[TRUNCADO]' }
        Write-Host ('Resposta: ' + $body)
    } catch {
        if ($_.Exception.Response) { try { Write-Host ('HTTP: ' + [int]$_.Exception.Response.StatusCode) } catch {} }
        Write-Host ('Falha: ' + $_.Exception.Message)
    }
    Write-Host ''
}

Write-Host '=== PORTAS ==='
foreach ($port in @(3000, 8765)) {
    $conn = Test-NetConnection -ComputerName 127.0.0.1 -Port $port -WarningAction SilentlyContinue
    Write-Host ('127.0.0.1:{0} TcpTestSucceeded={1}' -f $port, $conn.TcpTestSucceeded)
}
