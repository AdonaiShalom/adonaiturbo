'use strict';
(function attach(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AdonaiTradeSedeMenu = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createMenu() {
  const SYMBOLS = Object.freeze({ CRYPTO: 'BTCUSDT', FOREX: 'EURUSD', B3: 'PETR4', INTERNATIONAL: 'AAPL' });
  const MARKET_SYMBOLS = Object.freeze({
    CRYPTO: Object.freeze(['BTCUSDT','ETHUSDT','BNBUSDT','SOLUSDT','XRPUSDT']),
    FOREX: Object.freeze(['EURUSD','GBPUSD','USDJPY','AUDUSD','USDCAD','USDCHF','NZDUSD']),
    B3: Object.freeze(['PETR4','VALE3','ITUB4','BBDC4','BBAS3','B3SA3','WEGE3']),
    INTERNATIONAL: Object.freeze(['AAPL','MSFT','NVDA','AMZN','GOOGL','META','TSLA'])
  });
  const CHART_SYMBOLS = Object.freeze({ CRYPTO: Object.freeze({symbol:'BINANCE:BTCUSDT',label:'Cripto — BTC/USDT'}), FOREX: Object.freeze({symbol:'OANDA:EURUSD',label:'Forex — EUR/USD'}), B3: Object.freeze({symbol:'BMFBOVESPA:PETR4',label:'B3 — PETR4'}), INTERNATIONAL: Object.freeze({symbol:'NASDAQ:AAPL',label:'Internacional — AAPL'}) });
  const MENU = Object.freeze([
    {id:'overview',label:'Sede 3D',group:'Operação'},
    {id:'rh',label:'RH e equipes',group:'Operação'},
    {id:'CRYPTO',label:'Cripto',group:'Quatro mercados'},
    {id:'FOREX',label:'Forex',group:'Quatro mercados'},
    {id:'B3',label:'B3',group:'Quatro mercados'},
    {id:'INTERNATIONAL',label:'Internacional',group:'Quatro mercados'},
    {id:'charts',label:'TradingView',group:'Fontes'},
    {id:'investing',label:'Investing.com',group:'Fontes'},
    {id:'brapi',label:'Brapi — dados B3',group:'Fontes'},
    {id:'greed',label:'Fear & Greed',group:'Fontes'},
    {id:'intelligence',label:'Inteligência e risco',group:'Controle'},
    {id:'levi',label:'LEVI',group:'Integrações'},
    {id:'eu-sou',label:'EU SOU',group:'Integrações'},
    {id:'audit',label:'Auditoria e saúde',group:'Controle'}
  ]);
  function getMenu() { return MENU.map(item => ({...item})); }
  function formatTime(value) {
    if (!value || !Number.isFinite(Date.parse(value))) return 'Horário não verificado';
    return new Date(value).toLocaleString('pt-BR');
  }
  function mount(options = {}) {
    if (typeof document === 'undefined') throw new Error('browser_document_required');
    const rootElement = options.root || document.body;
    if (!rootElement || typeof rootElement.appendChild !== 'function') throw new Error('menu_root_required');
    if (document.getElementById('adonai-trade-sede-menu')) return {destroy(){}};
    const baseUrl = String(options.runtimeBaseUrl || 'http://127.0.0.1:3107').replace(/\/$/,'');
    const style = document.createElement('style');
    style.id = 'adonai-trade-sede-menu-style';
    style.textContent = [
      '#adonai-trade-sede-menu{position:fixed;z-index:2147482000;left:12px;top:12px;bottom:12px;width:260px;display:flex;flex-direction:column;background:#071321f2;color:#e8f1ff;border:1px solid #35516e;border-radius:14px;box-shadow:0 12px 42px #0008;font:14px/1.4 system-ui,sans-serif}',
      '#adonai-trade-sede-menu *{box-sizing:border-box}#adonai-trade-sede-menu .head{padding:15px;border-bottom:1px solid #2a4058}#adonai-trade-sede-menu .brand{font-size:16px;font-weight:750;color:#ffc83d}#adonai-trade-sede-menu .sub{font-size:11px;color:#9eb2c8;margin-top:4px}#adonai-trade-sede-menu nav{overflow:auto;padding:8px;flex:1}#adonai-trade-sede-menu .group{padding:10px 8px 4px;color:#8098b3;text-transform:uppercase;font-size:10px;letter-spacing:.12em}#adonai-trade-sede-menu button{font:inherit;cursor:pointer}#adonai-trade-sede-menu nav button{display:block;width:100%;text-align:left;border:1px solid transparent;border-radius:8px;background:transparent;color:#dce8f6;padding:9px 10px;margin:2px 0}#adonai-trade-sede-menu nav button[aria-current=true]{background:#17304b;border-color:#48698a;color:white}#adonai-trade-sede-menu .foot{padding:12px;border-top:1px solid #2a4058;font-size:11px;color:#a9bed3}',
      '#adonai-trade-sede-panel{position:fixed;z-index:2147481999;left:284px;top:12px;bottom:12px;width:min(460px,calc(100vw - 300px));overflow:auto;background:#0b1828f5;color:#e8f1ff;border:1px solid #35516e;border-radius:14px;box-shadow:0 12px 42px #0008;padding:18px;font:14px/1.5 system-ui,sans-serif}#adonai-trade-sede-panel h2{font-size:18px;margin:0 0 12px;color:#ffc83d}#adonai-trade-sede-panel p{margin:8px 0;color:#c6d4e4}#adonai-trade-sede-panel .card{border:1px solid #2e4761;border-radius:10px;padding:12px;margin:9px 0;background:#102238}#adonai-trade-sede-panel .state{font-size:11px;color:#9fc0dc;text-transform:uppercase}#adonai-trade-sede-panel a{color:#65dfff;text-decoration:underline}#adonai-trade-sede-panel iframe{width:100%;height:320px;border:0;border-radius:8px;background:#101c2a}#adonai-trade-sede-panel button{background:#183652;color:white;border:1px solid #4a6c8d;border-radius:7px;padding:7px 10px;margin:6px 5px 0 0}#adonai-trade-sede-panel .danger{color:#ffcc8d;font-weight:650}@media(max-width:700px){#adonai-trade-sede-menu{width:180px}#adonai-trade-sede-panel{left:200px;width:calc(100vw - 212px)}}'
    ].join('\n');
    document.head.appendChild(style);
    const menu = document.createElement('aside'); menu.id = 'adonai-trade-sede-menu'; menu.setAttribute('aria-label','Menu Adonai Trade');
    const head = document.createElement('div'); head.className='head';
    const brand=document.createElement('div'); brand.className='brand'; brand.textContent='ADONAI TRADE';
    const sub=document.createElement('div'); sub.className='sub'; sub.textContent='Sede 3D • modo paper • execução desabilitada'; head.append(brand,sub);
    const nav=document.createElement('nav'); nav.setAttribute('aria-label','Módulos');
    const buttons=new Map(); let lastGroup='';
    for(const item of MENU){
      if(item.group!==lastGroup){const g=document.createElement('div');g.className='group';g.textContent=item.group;nav.appendChild(g);lastGroup=item.group;}
      const b=document.createElement('button');b.type='button';b.textContent=item.label;b.addEventListener('click',()=>render(item.id));nav.appendChild(b);buttons.set(item.id,b);
    }
    const footer=document.createElement('div');footer.className='foot';footer.textContent='Runtime: aguardando leitura…';menu.append(head,nav,footer);
    const panel=document.createElement('section');panel.id='adonai-trade-sede-panel';panel.setAttribute('aria-live','polite');panel.setAttribute('aria-label','Painel do módulo');
    rootElement.append(menu,panel);
    let state=null,current='overview',timer=null,destroyed=false;
    function node(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
    function card(title,status,detail){const c=node('div',undefined,'card');c.append(node('strong',title),node('div',status,'state'),node('p',detail));return c;}
    function external(url,label){const a=node('a',label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
    function render(id){
      current=id;for(const [key,b] of buttons)b.setAttribute('aria-current',String(key===id));
      panel.replaceChildren();const item=MENU.find(x=>x.id===id);panel.append(node('h2',item?item.label:'Adonai Trade'),node('div','PAPER • ordens reais desabilitadas','danger'));
      if(id==='overview'){
        panel.append(card('Sede original','Cena preservada','Esta camada complementa a cena 3D original; não a substitui.'),card('Runtime 3107',state?'Leitura recebida':'Aguardando / indisponível',state?'Última leitura: '+formatTime(state.fetchedAt):'Ainda não há confirmação de conexão.'));
        panel.append(card('Dados e evidências','Sem inferências','Atividade de equipes e probabilidades só aparecem quando o runtime fornecer evidência verificável.'));
      } else if(['CRYPTO','FOREX','B3','INTERNATIONAL'].includes(id)){
        const d=state&&state.desks.find(x=>x.id===id);
        const symbols=MARKET_SYMBOLS[id]||[SYMBOLS[id]];
        const selector=node('select');selector.setAttribute('aria-label','Selecionar instrumento de '+id);selector.style.cssText='max-width:100%;padding:8px;background:#102238;color:#e8f1ff;border:1px solid #4a6c8d;border-radius:7px;margin:6px 0';
        for(const symbol of symbols){const opt=node('option',symbol);opt.value=symbol;selector.appendChild(opt);}
        panel.append(card('Mesa '+id,d?d.quoteStatus:'runtime indisponível',d?'Provedor: '+d.provider+'. Configurado: '+(d.providerConfigured?'sim':'não')+'. Modo: '+d.dataMode+'.':'Sem estado atual confirmado.'),selector);
        const b=node('button','Consultar cotação');b.type='button';b.addEventListener('click',async()=>{
          const selectedSymbol=selector.value;
          b.disabled=true;b.textContent='Consultando…';let result;
          try{const r=await fetch(baseUrl+'/api/v1/markets/quote?desk='+encodeURIComponent(id)+'&symbol='+encodeURIComponent(selectedSymbol),{headers:{accept:'application/json'},cache:'no-store'});result={ok:r.ok,data:await r.json(),status:r.status};}
          catch(e){result={ok:false,error:e&&e.message?e.message:'erro de rede'};}
          b.disabled=false;b.textContent='Consultar cotação';const old=panel.querySelector('[data-quote]');if(old)old.remove();const out=node('div',undefined,'card');out.dataset.quote='1';
          if(!result.ok)out.append(node('strong','Cotação indisponível'),node('p',result.error||('HTTP '+result.status)));
          else{const q=result.data;out.append(node('strong','Estado: '+String(q.status||'não verificado')));if(q.status==='verified'&&q.price!==null&&q.price!==undefined&&q.price!==''&&Number.isFinite(Number(q.price))&&Number(q.price)>0)out.append(node('p',String(q.symbol)+': '+String(q.price)+' '+String(q.currency||'')));else{out.append(node('p','Preço não apresentado como atual: frescor intradiário não comprovado.'));if(q.reason_code)out.append(node('p','Motivo: '+q.reason_code));}out.append(node('p','Fonte: '+String(q.source||'não informada')),node('p','Horário: '+formatTime(q.observed_at)));}
          panel.appendChild(out);
        });panel.append(b,node('p','Consulta somente leitura. Nenhuma ordem é enviada.'));
      } else if(id==='rh'){
        panel.append(card('RH e equipes','Lendo estado persistido','Papéis e tarefas vêm do Supabase; o catálogo de papéis não significa que um agente esteja ativo.'));
        const load=node('button','Atualizar RH');load.type='button';
        load.addEventListener('click',async()=>{
          load.disabled=true;load.textContent='Consultando Supabase…';let result;
          try{const r=await fetch(baseUrl+'/api/v1/rh',{headers:{accept:'application/json'},cache:'no-store'});result={ok:r.ok,data:await r.json(),status:r.status};}
          catch(e){result={ok:false,error:e&&e.message?e.message:'erro de rede'};}
          load.disabled=false;load.textContent='Atualizar RH';
          const old=panel.querySelector('[data-rh-result]');if(old)old.remove();
          const out=node('div',undefined,'card');out.dataset.rhResult='1';
          if(!result.ok){out.append(node('strong','RH indisponível'),node('p',result.error||('HTTP '+result.status)),node('p','Não foi possível confirmar o estado persistido.'));}
          else{
            const d=result.data;
            out.append(node('strong','Estado: '+String(d.status||'não verificado')),node('p','Atualizado: '+formatTime(d.fetched_at)),node('p','Funções cadastradas: '+(Array.isArray(d.roles)?d.roles.length:0)),node('p','Tarefas persistidas: '+(Array.isArray(d.tasks)?d.tasks.length:0)));
            for(const role of (Array.isArray(d.roles)?d.roles:[]))out.append(node('p',String(role.label||role.role_key)+' — '+String(role.activity_status||'not_reported')));
            if(Array.isArray(d.tasks)&&d.tasks.length){for(const task of d.tasks.slice(0,20))out.append(node('p','#'+String(task.task_key)+' — '+String(task.title)+' ['+String(task.status)+']'));}
            else out.append(node('p','Nenhuma tarefa RH registrada. Não há atividade operacional comprovada.'));
            out.append(node('p','Execução habilitada: não'));
          }
          panel.appendChild(out);
        });
        panel.append(load,node('p','Leitura somente; criação e mudança de tarefas precisam passar por LEVI/backend autenticado e gerar auditoria.'));
      } else if(id==='charts'){
        panel.append(node('p','TradingView — gráfico de visualização. Não é, por si só, uma fonte autorizada para execução.'));
        const selector=node('select');selector.setAttribute('aria-label','Selecionar mercado do gráfico');selector.style.cssText='max-width:100%;padding:8px;background:#102238;color:#e8f1ff;border:1px solid #4a6c8d;border-radius:7px;margin:6px 0';
        for(const [key,entry] of Object.entries(CHART_SYMBOLS)){const opt=node('option',entry.label);opt.value=key;selector.appendChild(opt);}
        const chartWrap=node('div');chartWrap.dataset.chart='1';
        function showChart(key){const entry=CHART_SYMBOLS[key]||CHART_SYMBOLS.CRYPTO;chartWrap.replaceChildren();const f=document.createElement('iframe');f.title='TradingView '+entry.label;f.loading='lazy';f.referrerPolicy='strict-origin-when-cross-origin';const params=new URLSearchParams({symbol:entry.symbol,interval:'15',hidesidetoolbar:'0',symboledit:'1',saveimage:'0',toolbarbg:'#0b1828',theme:'dark',style:'1',timezone:'Etc/UTC',withdateranges:'1',hideideas:'1',locale:'br'});f.src='https://www.tradingview.com/widgetembed/?'+params.toString();chartWrap.appendChild(f);const link=external('https://www.tradingview.com/chart/?symbol='+encodeURIComponent(entry.symbol),'Abrir '+entry.symbol+' no TradingView');const prior=panel.querySelector('[data-chart-link]');if(prior)prior.remove();link.dataset.chartLink='1';panel.appendChild(link);}
        selector.addEventListener('change',()=>showChart(selector.value));panel.append(selector,chartWrap,node('p','A seleção altera o gráfico, não a fonte independente das cotações operacionais.'));showChart('CRYPTO');
      } else if(id==='investing'){
        panel.append(card('Investing.com','Calendário econômico oficial','Para incorporar um widget, o proprietário do site deve aceitar os termos do fornecedor e gerar o código oficial. Nenhum dado é raspado nem tratado como feed de execução.'),external('https://www.investing.com/economic-calendar/','Abrir calendário econômico Investing.com'),external('https://br.investing.com/webmaster-tools/economic-calendar','Configurar widget oficial e revisar termos'));
      } else if(id==='brapi'){
        panel.append(card('Brapi — dados da B3','Consulta de leitura somente','Esta verificação consulta o adaptador B3 do runtime. A credencial fica somente no servidor e nunca é exibida no menu.'));
        const load=node('button','Testar leitura B3 via Brapi');load.type='button';
        load.addEventListener('click',async()=>{
          load.disabled=true;load.textContent='Consultando B3…';let result;
          try{const r=await fetch(baseUrl+'/api/v1/markets/quote?desk=B3&symbol=PETR4',{headers:{accept:'application/json'},cache:'no-store'});result={ok:r.ok,data:await r.json(),status:r.status};}
          catch(e){result={ok:false,error:e&&e.message?e.message:'erro de rede'};}
          load.disabled=false;load.textContent='Testar leitura B3 via Brapi';
          const old=panel.querySelector('[data-brapi-result]');if(old)old.remove();
          const out=node('div',undefined,'card');out.dataset.brapiResult='1';
          if(!result.ok){out.append(node('strong','Consulta indisponível'),node('p',result.error||('HTTP '+result.status)),node('p','Verifique a conectividade do runtime e a configuração privada da fonte.'));}
          else{
            const q=result.data||{};
            out.append(node('strong','Estado: '+String(q.status||'não verificado')));
            if(q.status==='verified'&&q.price!==null&&q.price!==undefined&&q.price!==''&&Number.isFinite(Number(q.price))&&Number(q.price)>0)out.append(node('p','PETR4: '+String(q.price)+' '+String(q.currency||'BRL')));
            else out.append(node('p','Preço não confirmado como atual; não usar como cotação validada.'));
            out.append(node('p','Fonte: '+String(q.source||'não informada')),node('p','Observado em: '+formatTime(q.observed_at)),node('p','Motivo: '+String(q.reason_code||'nenhum informado')),node('p','Modo: somente leitura; execução habilitada: não'));
          }
          panel.appendChild(out);
        });
        panel.append(load,external('https://brapi.dev/','Abrir Brapi'),external('https://brapi.dev/docs','Documentação da API'),node('p','O teste confirma apenas a leitura deste símbolo. Outros ativos e contratos precisam ser validados individualmente.'));
      } else if(id==='greed'){
        panel.append(card('Fear & Greed','Indicador de sentimento — não é sinal de trade','Fonte: Alternative.me. Escala 0–100; dado diário. Não é probabilidade de lucro nem habilita ordens.'));
        const load=node('button','Consultar índice');load.type='button';
        load.addEventListener('click',async()=>{
          load.disabled=true;load.textContent='Consultando fonte…';let result;
          try{const r=await fetch(baseUrl+'/api/v1/sentiment/fear-greed',{headers:{accept:'application/json'},cache:'no-store'});result={ok:r.ok,data:await r.json(),status:r.status};}
          catch(e){result={ok:false,error:e&&e.message?e.message:'erro de rede'};}
          load.disabled=false;load.textContent='Consultar índice';
          const old=panel.querySelector('[data-greed]');if(old)old.remove();
          const out=node('div',undefined,'card');out.dataset.greed='1';
          if(!result.ok){out.append(node('strong','Índice indisponível'),node('p',result.error||('HTTP '+result.status)));}
          else{const d=result.data;out.append(node('strong','Estado: '+String(d.status||'não verificado')));
            if(Number.isInteger(d.value)&&d.value>=0&&d.value<=100)out.append(node('p','Valor: '+d.value+'/100 — '+String(d.classification||'classificação não informada')));
            else out.append(node('p','Valor não validado; não usar.'));
            out.append(node('p','Observado em: '+formatTime(d.observed_at)),node('p','Idade do dado: '+(Number.isFinite(d.age_seconds)?Math.round(d.age_seconds/3600)+' h':'não verificada')),node('p','Fonte: '+String(d.source_url||'não informada')),node('p','Execução habilitada: não'));
          }
          panel.appendChild(out);
        });
        panel.append(load,external('https://alternative.me/crypto/fear-and-greed-index/','Abrir fonte pública Crypto Fear & Greed'),node('p','Dado de sentimento separado das cotações de mercado; status stale/unverified não deve ser usado para decisões automáticas.'));
      } else if(id==='levi'||id==='eu-sou'){
        const target=id==='levi'?'levi':'eu_sou';const i=state&&state.integrations.find(x=>String(x.id).toLowerCase()===target);
        panel.append(card(id==='levi'?'LEVI':'EU SOU',i?i.status:'Não verificado',id==='levi'?'A integração exige teste ponta a ponta, correlação da tarefa e evento de auditoria.':'O motor científico precisa devolver entrada, método, unidades, resultado e evidência reproduzível.'));
      } else if(id==='intelligence'){
        panel.append(card('Risco e inteligência','Fail-closed','Modelos e probabilidades exigem versão, dados, custos, método e validação fora da amostra.'),card('Política','Execução desabilitada','Sem auditoria ou dados verificáveis, bloquear e explicar a decisão.'));
      } else if(id==='audit'){
        panel.append(card('Auditoria','Ponta a ponta não verificada','Não afirmar gravação até confirmar escrita e leitura do ledger.'),card('Runtime',state?'Última leitura: '+formatTime(state.fetchedAt):'Indisponível',state?'Mercados: '+formatTime(state.runtimeTimestamps.markets)+'; integrações: '+formatTime(state.runtimeTimestamps.integrations):'Nenhum snapshot disponível.'));
      }
    }
    async function refresh(){
      if(destroyed)return;
      try{const bridge=root.AdonaiTradeRuntimeBridge;if(!bridge||typeof bridge.readState!=='function')throw new Error('runtime_bridge_unavailable');state=await bridge.readState({baseUrl});footer.textContent=(state.status==='ready'?'Runtime pronto • auditoria verificada':'Runtime não pronto')+' • '+formatTime(state.fetchedAt)+' • modo paper';}
      catch{state=null;footer.textContent='Runtime indisponível • sem dados atuais • modo paper';}
      // Polling must not destroy a module's active controls or query results every 15 seconds.
      // The overview is safe to refresh automatically; other modules refresh on explicit navigation/action.
      if(!destroyed && current==='overview')render(current);
    }
    render('overview');refresh();timer=setInterval(refresh,Number.isFinite(options.pollIntervalMs)&&options.pollIntervalMs>=1000?options.pollIntervalMs:15000);
    return {refresh,destroy(){destroyed=true;if(timer)clearInterval(timer);menu.remove();panel.remove();style.remove();}};
  }
  return Object.freeze({getMenu,mount,MENU,SYMBOLS,MARKET_SYMBOLS,CHART_SYMBOLS});
});
