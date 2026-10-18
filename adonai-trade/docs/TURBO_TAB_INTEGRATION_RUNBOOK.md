# Adonai Trade — runbook de integração local com a sede 3D original

> **Hierarquia do planejamento:** o plano canônico único está em [SEDE3D_MENU_FUNCIONAL_E_MATRIZ_DE_INTEGRACAO.md](./SEDE3D_MENU_FUNCIONAL_E_MATRIZ_DE_INTEGRACAO.md). Este arquivo é apenas um procedimento técnico subordinado; checklists anteriores não são objetivos paralelos e devem ser lidos segundo o plano canônico versão 25% → 100%.


## Objetivo

Conectar o protótipo original `PROTOTIPO_Sede3D_abrir_no_navegador.html` à aba Adonai Trade de `C:\\AdonaiTurbo\\frontend\\index.html`, mantendo o runtime independente em `C:\\AdonaiTurbo\\AdonaiTrade` na porta 3100. O Turbo permanece em 3000 e o PSM Grupo Market em 3001.

Este runbook não declara que a integração já ocorreu. O repositório conectado não contém o `frontend/index.html` real do Turbo nem o arquivo original de 75.915 bytes; portanto, uma edição automática do HTML seria especulativa e poderia danificar a navegação existente.

## Estado conhecido e limite de evidência

- A ponte HTTP e o cliente de polling estão no pacote isolado e têm testes automatizados.
- O CI do repositório executou os testes de contrato da ponte com sucesso.
- Isso não prova que o protótipo está incorporado no Turbo, que o serviço local da porta 3100 está saudável, que há cotações ao vivo ou que o ledger de auditoria está gravando eventos.
- O HTML original deve ser preservado e comparado por hash antes de qualquer patch.
- Modo paper; execução financeira real desabilitada.

## Procedimento controlado no Windows

Executar em PowerShell 5.1. O procedimento abaixo é diagnóstico apenas: não edita arquivos, não inicia ordens e não toca no PSM.

```powershell
$ErrorActionPreference = 'Stop'
$Turbo = 'C:\\AdonaiTurbo'
$Trade = Join-Path $Turbo 'AdonaiTrade'
$Index = Join-Path $Turbo 'frontend\\index.html'
$PrototypeCandidates = @(
  (Join-Path $Trade 'public\\sede3d.html'),
  (Join-Path $env:USERPROFILE 'Downloads\\PROTOTIPO_Sede3D_abrir_no_navegador.html'),
  (Join-Path $Turbo 'PROTOTIPO_Sede3D_abrir_no_navegador.html')
)

Write-Host '=== 1. PRESENÇA DOS ARQUIVOS ===' -ForegroundColor Cyan
[pscustomobject]@{ TurboIndex = (Test-Path $Index); TradeRoot = (Test-Path $Trade) } | Format-List
$PrototypeCandidates | ForEach-Object {
  if (Test-Path $_) {
    $f = Get-Item $_
    $h = Get-FileHash $_ -Algorithm SHA256
    [pscustomobject]@{ Prototype = $f.FullName; Bytes = $f.Length; SHA256 = $h.Hash }
  }
} | Format-List

Write-Host '=== 2. PORTAS E ENDPOINTS ===' -ForegroundColor Cyan
foreach ($Port in @(3000,3100,3001)) {
  $listeners = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
  [pscustomobject]@{ Port = $Port; Listening = [bool]$listeners; PIDs = (($listeners | Select-Object -ExpandProperty OwningProcess -Unique) -join ',') }
}
foreach ($Url in @(
  'http://127.0.0.1:3000/',
  'http://127.0.0.1:3100/api/v1/markets',
  'http://127.0.0.1:3100/api/v1/integrations'
)) {
  try {
    $r = Invoke-WebRequest -Uri $Url -TimeoutSec 4 -UseBasicParsing
    [pscustomobject]@{ URL = $Url; Status = [int]$r.StatusCode; Bytes = $r.RawContentLength }
  } catch {
    [pscustomobject]@{ URL = $Url; Status = 'ERRO'; Detail = $_.Exception.Message }
  }
}
Write-Host 'Diagnóstico concluído; nenhum arquivo foi alterado.' -ForegroundColor Green
```

## Regras obrigatórias para o patch final

1. Criar cópia de segurança do `frontend/index.html` e registrar SHA-256 antes da alteração.
2. Localizar a aba/rota Trade real e o inicializador do protótipo original; não substituir a navegação inteira nem recriar a sede em um HTML genérico.
3. Preferir uma integração same-origin/proxy para as rotas `/api/v1/markets` e `/api/v1/integrations`; não abrir CORS indiscriminado.
4. A ponte deve falhar fechada: `executionEnabled: false`, status de indisponibilidade explícito e nenhum indicador antigo apresentado como atual.
5. Não inventar agentes em atividade, decisões, probabilidades ou cotações. `probability: null` permanece “não disponível”; atividade não instrumentada permanece “não reportada”.
6. Preservar Turbo (3000), Trade (3100) e PSM (3001) como sistemas separados.
7. Testar inicialização, navegação entre abas, atualização periódica, erro de rede, payload inválido, retorno ao Turbo e ausência de efeitos colaterais.
8. Executar os testes de contrato e os testes locais do projeto em cópia isolada quando houver testes que gravem/apaguem dados.
9. Registrar diff, hashes antes/depois, resultados dos testes e plano de rollback.
10. Só remover o bloqueio de integração após evidência visual do protótipo original funcionando dentro da aba Trade.

## Critério de conclusão

A tarefa só pode ser marcada concluída quando o protótipo original estiver efetivamente acessível dentro do Turbo, os três serviços continuarem isolados, o runtime local responder aos contratos esperados, a interface não fabricar estado e os testes de regressão/rollback tiverem evidência reproduzível. CI verde isoladamente não satisfaz esses critérios.
