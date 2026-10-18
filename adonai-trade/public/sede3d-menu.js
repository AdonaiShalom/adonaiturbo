'use strict';
(function attach(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AdonaiTradeSedeMenu = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createMenu() {
  const SYMBOLS = Object.freeze({ CRYPTO: 'BTCUSDT', FOREX: 'EURUSD', B3: 'PETR4', INTERNATIONAL: 'AAPL' });
  const MENU = Object.freeze([
    {id:'overview',label:'Sede 3D',group:'Operação'},
    {id:'rh',label:'RH e equipes',group:'Operação'},
    {id:'CRYPTO',label:'Cripto',group:'Quatro mercados'},
    {id:'FOREX',label:'Forex',group:'Quatro mercados'},
    {id:'B3',label:'B3',group:'Quatro mercados'},
    {id:'INTERNATIONAL',label:'Internacional',group:'Quatro mercados'},
    {id:'charts',label:'TradingView',group:'Fontes'},
    {id:'investing',label:'Investing.com',group:'Fontes'},
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
    const baseUrl = String(options.runtimeBaseUrl || '').replace(/\/$/,'');
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
        panel.append(card('Sede original','Cena preservada','Esta camada complementa a cena 3D original; não a substitui.'),card('Runtime 3100',state?'Leitura recebida':'Aguardando / indisponível',state?'Última leitura: '+formatTime(state.fetchedAt):'Ainda não há confirmação de conexão.'));
        panel.append(card('Dados e evidências','Sem inferências','Atividade de equipes e probabilidades só aparecem quando o runtime fornecer evidência verificável.'));
      } else if(['CRYPTO','FOREX','B3','INTERNATIONAL'].includes(id)){
        const d=state&&state.desks.find(x=>x.id===id);
        const symbols={CRYPTO:'BTCUSDT',FOREX:'EURUSD',B3:'PETR4',INTERNATIONAL:'AAPL'};
        panel.append(card(symbols[id],d?d.quoteStatus:'runtime indisponível',d?'Provedor: '+d.provider+'. Configurado: '+(d.providerConfigured?'sim':'não')+'. Modo: '+d.dataMode+'.':'Sem estado atual confirmado.'));
        const b=node('button','Consultar cotação');b.type='button';b.addEventListener('click',async()=>{
          b.disabled=true;b.textContent='Consultando…';let result;
          try{const r=await fetch(baseUrl+'/api/v1/markets/quote?desk='+encodeURIComponent(id)+'&symbol='+encodeURIComponent(symbols[id]),{headers:{accept:'application/json'},cache:'no-store'});result={ok:r.ok,data:await r.json(),status:r.status};}
          catch(e){result={ok:false,error:e&&e.message?e.message:'erro de rede'};}
          b.disabled=false;b.textContent='Consultar cotação';const old=panel.querySelector('[data-quote]');if(old)old.remove();const out=node('div',undefined,'card');out.dataset.quote='1';
          if(!result.ok)out.append(node('strong','Cotação indisponível'),node('p',result.error||('HTTP '+result.status)));
          else{const q=result.data;out.append(node('strong','Estado: '+String(q.status||'não verificado')));if(q.status==='verified'&&Number.isFinite(Number(q.price)))out.append(node('p',String(q.symbol)+': '+String(q.price)+' '+String(q.currency||'')));else{out.append(node('p','Preço não apresentado como atual: frescor intradiário não comprovado.'));if(q.reason_code)out.append(node('p','Motivo: '+q.reason_code));}out.append(node('p','Fonte: '+String(q.source||'não informada')),node('p','Horário: '+formatTime(q.observed_at)));}
          panel.appendChild(out);
        });panel.append(b,node('p','Consulta somente leitura. Nenhuma ordem é enviada.'));
      } else if(id==='rh'){
        panel.append(card('RH e equipes','Atividade não reportada','O runtime não expõe ainda um contrato de RH com tarefas e eventos reais. Não serão inventados agentes ativos ou produtividade.'),card('Requisito','Contrato + auditoria','Cada agente precisa de ID, função, tarefa, estado, timestamp e evidência persistida.'));
      } else if(id==='charts'){
        panel.append(node('p','TradingView — widget de visualização. O gráfico não é, por si só, uma fonte autorizada para execução.'));
        const f=document.createElement('iframe');f.title='Widget TradingView BTCUSDT';f.loading='lazy';f.referrerPolicy='no-referrer';f.src='https://www.tradingview.com/widgetembed/?symbol=BINANCE%3ABTCUSDT&interval=15&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=%230b1828&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1&locale=br';panel.append(f,external('https://www.tradingview.com/','Abrir TradingView'),node('p','Símbolo inicial: BINANCE:BTCUSDT. Confirme símbolo e mercado antes da análise.'));
      } else if(id==='investing'){
        panel.append(card('Investing.com','Fonte externa','Calendário e páginas oficiais; integração embutida depende dos recursos permitidos pelo fornecedor.'),external('https://www.investing.com/economic-calendar/','Abrir calendário econômico Investing.com'));
      } else if(id==='greed'){
        panel.append(card('Fear & Greed','Não conectado ao runtime','O indicador exige provedor, escala, timestamp e verificação. Não é probabilidade de lucro nem sinal automático.'),external('https://alternative.me/crypto/fear-and-greed-index/','Abrir fonte pública Crypto Fear & Greed'));
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
      try{const bridge=root.AdonaiTradeRuntimeBridge;if(!bridge||typeof bridge.readState!=='function')throw new Error('runtime_bridge_unavailable');state=await bridge.readState({baseUrl});footer.textContent='Runtime conectado • '+formatTime(state.fetchedAt)+' • modo paper';}
      catch{state=null;footer.textContent='Runtime indisponível • sem dados atuais • modo paper';}
      if(!destroyed)render(current);
    }
    render('overview');refresh();timer=setInterval(refresh,Number.isFinite(options.pollIntervalMs)&&options.pollIntervalMs>=1000?options.pollIntervalMs:15000);
    return {refresh,destroy(){destroyed=true;if(timer)clearInterval(timer);menu.remove();panel.remove();style.remove();}};
  }
  return Object.freeze({getMenu,mount,MENU,SYMBOLS});
});
