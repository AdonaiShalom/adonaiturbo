[CmdletBinding()]
param(
    [string]$ProjectPath = (Split-Path -Parent $PSScriptRoot),
    [int]$Port = 3107
)
$ErrorActionPreference = 'Stop'
$ProjectPath = (Resolve-Path $ProjectPath).Path
$Node = Get-Command node.exe -ErrorAction Stop
$Npm = Get-Command npm.cmd -ErrorAction Stop
$ServerProcess = $null
$PreviousPort = $env:PORT
$PreviousHost = $env:HOST
function Assert-Equal {
    param($Actual, $Expected, [string]$Message)
    if ($Actual -ne $Expected) { throw "$Message (esperado: '$Expected'; recebido: '$Actual')" }
}
function Get-JsonResponse {
    param([string]$Url, [int[]]$AllowedStatus = @(200))
    $StatusCode = 0
    $Headers = $null
    $Content = $null
    try {
        $Response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 4 -UseBasicParsing -ErrorAction Stop
        $StatusCode = [int]$Response.StatusCode
        $Headers = $Response.Headers
        $Content = [string]$Response.Content
    } catch {
        # PowerShell 5.1 throws on HTTP 4xx/5xx; capture the response so 503 readiness can be tested.
        $HttpResponse = $_.Exception.Response
        if ($null -eq $HttpResponse) { throw }
        $StatusCode = [int]$HttpResponse.StatusCode
        $Headers = $HttpResponse.Headers
        $Stream = $HttpResponse.GetResponseStream()
        if ($Stream) {
            $Reader = New-Object System.IO.StreamReader($Stream)
            try { $Content = $Reader.ReadToEnd() } finally { $Reader.Dispose() }
        } else { $Content = '{}' }
    }
    if ($AllowedStatus -notcontains $StatusCode) {
        throw "HTTP inesperado em $Url : $StatusCode"
    }
    if ([string]::IsNullOrWhiteSpace($Content) -and $StatusCode -ge 400) {
        $Body = $null
    } else {
        try { $Body = $Content | ConvertFrom-Json -ErrorAction Stop }
        catch { throw "Resposta JSON inválida em $Url (HTTP $StatusCode)." }
    }
    return [pscustomobject]@{
        StatusCode = $StatusCode
        Headers = $Headers
        Body = $Body
    }
}
try {
    if ([int]((& $Node.Source --version).TrimStart('v').Split('.')[0]) -lt 22) { throw 'Node.js 22 ou superior é obrigatório.' }
    if ($Port -lt 1024 -or $Port -gt 65535) { throw 'Escolha uma porta de teste entre 1024 e 65535.' }
    Write-Host '1/5 - Testes automatizados do runtime' -ForegroundColor Cyan
    Push-Location $ProjectPath
    try {
        & $Npm.Source test
        if ($LASTEXITCODE -ne 0) { throw "npm test falhou com código $LASTEXITCODE" }
    } finally { Pop-Location }
    Write-Host '2/5 - Inicializando runtime isolado em loopback' -ForegroundColor Cyan
    $env:PORT = [string]$Port
    $env:HOST = '127.0.0.1'
    $ServerProcess = Start-Process -FilePath $Node.Source -ArgumentList @('runtime/server.cjs') -WorkingDirectory $ProjectPath -PassThru -WindowStyle Hidden
    $Base = "http://127.0.0.1:$Port"
    $Health = $null
    for ($Attempt = 0; $Attempt -lt 20; $Attempt++) {
        if ($ServerProcess.HasExited) { throw "Runtime encerrou durante a inicialização (código $($ServerProcess.ExitCode))." }
        try { $Health = Get-JsonResponse -Url "$Base/health"; break } catch { Start-Sleep -Milliseconds 250 }
    }
    if (-not $Health) { throw 'Runtime não respondeu em até 5 segundos.' }
    Write-Host '3/5 - Validando cabeçalhos e modo seguro' -ForegroundColor Cyan
    Assert-Equal $Health.Body.mode 'paper' 'Modo do runtime'
    Assert-Equal $Health.Headers['Cache-Control'] 'no-store' 'Cache-Control'
    Assert-Equal $Health.Headers['X-Content-Type-Options'] 'nosniff' 'X-Content-Type-Options'
    Assert-Equal $Health.Headers['X-Frame-Options'] 'DENY' 'X-Frame-Options'
    Assert-Equal $Health.Headers['Referrer-Policy'] 'no-referrer' 'Referrer-Policy'
    Assert-Equal $Health.Headers['Permissions-Policy'] 'camera=(), microphone=(), geolocation=()' 'Permissions-Policy'
    Write-Host '4/5 - Validando mesas e integrações sem alegar conexão' -ForegroundColor Cyan
    $Markets = (Get-JsonResponse -Url "$Base/api/v1/markets").Body
    Assert-Equal $Markets.mode 'paper' 'Modo das mesas'
    Assert-Equal $Markets.desks.Count 4 'Quantidade de mesas'
    Assert-Equal $Markets.data_status 'partially_configured' 'Estado de configuração dos provedores'
    Assert-Equal $Markets.execution_enabled $false 'Execução global habilitada'
    foreach ($Desk in $Markets.desks) {
        Assert-Equal $Desk.execution_enabled $false "Execução habilitada na mesa $($Desk.id)"
        Assert-Equal $Desk.quote_status 'not_checked' "Estado da cotação $($Desk.id)"
    }
    $Integrations = (Get-JsonResponse -Url "$Base/api/v1/integrations").Body
    foreach ($Integration in $Integrations.integrations) {
        Assert-Equal $Integration.authenticated $false "Autenticação alegada para $($Integration.id)"
        Assert-Equal $Integration.status 'not_verified' "Estado não verificado para $($Integration.id)"
        Assert-Equal $Integration.execution_enabled $false "Execução habilitada para $($Integration.id)"
    }
    $Ready = Get-JsonResponse -Url "$Base/ready" -AllowedStatus @(200, 503)
    if ($Ready.StatusCode -eq 503) { Write-Host 'HTTP 503 confirmado; runtime bloqueado sem auditoria.' -ForegroundColor Green } else { Assert-Equal $Ready.Body.status 'ready' 'Readiness com auditoria' }
    Write-Host '5/5 - Confirmando bloqueio de Content-Type não permitido' -ForegroundColor Cyan
    try {
        $Unsupported = Invoke-WebRequest -Uri "$Base/api/v1/policy/evaluate" -Method Post -ContentType 'text/plain' -Body '{"mode":"live"}' -TimeoutSec 4 -UseBasicParsing
        throw "Esperava HTTP 415; recebeu $($Unsupported.StatusCode)."
    } catch {
        if ($_.Exception.Response -and [int]$_.Exception.Response.StatusCode -eq 415) { Write-Host 'HTTP 415 confirmado; nenhuma ordem foi executada.' -ForegroundColor Green } else { throw }
    }
    Write-Host ''
    Write-Host 'VALIDAÇÃO LOCAL CONCLUÍDA' -ForegroundColor Green
    Write-Host 'Testes, quatro mesas, integrações não verificadas, cabeçalhos e bloqueio HTTP conferidos.'
    Write-Host 'Este teste NÃO prova cotação externa, gravação real no Supabase nem integração visual 3D.'
    exit 0
} catch {
    Write-Host "FALHA: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    if ($ServerProcess -and -not $ServerProcess.HasExited) { Stop-Process -Id $ServerProcess.Id -Force -ErrorAction SilentlyContinue }
    if ($null -eq $PreviousPort) { Remove-Item Env:PORT -ErrorAction SilentlyContinue } else { $env:PORT = $PreviousPort }
    if ($null -eq $PreviousHost) { Remove-Item Env:HOST -ErrorAction SilentlyContinue } else { $env:HOST = $PreviousHost }
}