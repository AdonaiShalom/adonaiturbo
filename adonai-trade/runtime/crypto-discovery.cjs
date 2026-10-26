'use strict';
const MAX_COINS=250;
const TIMEOUT_MS=5000;
const MAX_BYTES=2*1024*1024;
async function json(fetchImpl,url){
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),TIMEOUT_MS);
 try{const r=await fetchImpl(url,{method:'GET',headers:{accept:'application/json'},signal:controller.signal,redirect:'error'});if(!r.ok)throw new Error('provider_http_'+r.status);const len=Number(r.headers&&r.headers.get&&r.headers.get('content-length'));if(Number.isFinite(len)&&len>MAX_BYTES)throw new Error('provider_response_too_large');const data=await r.json();if(Buffer.byteLength(JSON.stringify(data))>MAX_BYTES)throw new Error('provider_response_too_large');return data;}finally{clearTimeout(timer);}
}
async function discoverCrypto({fetchImpl=globalThis.fetch,perPage=250,page=1}={}){
 if(typeof fetchImpl!=='function')return {status:'unavailable',reason_code:'fetch_unavailable',execution_enabled:false};
 const count=Math.max(1,Math.min(MAX_COINS,Number.isInteger(perPage)?perPage:MAX_COINS));
 const pageNumber=Number.isInteger(page)&&page>=1&&page<=40?page:1;
 try{
  const [coins,exchange]=await Promise.all([
   json(fetchImpl,'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page='+count+'&page='+pageNumber+'&sparkline=false'),
   json(fetchImpl,'https://demo-fapi.binance.com/fapi/v1/exchangeInfo')
  ]);
  if(!Array.isArray(coins)||!exchange||!Array.isArray(exchange.symbols))return {status:'unavailable',reason_code:'provider_schema_invalid',execution_enabled:false};
  const eligible=new Map();
  for(const s of exchange.symbols){if(s&&s.status==='TRADING'&&s.contractType==='PERPETUAL'&&s.quoteAsset==='USDT'&&/^[A-Z0-9]{5,15}$/.test(s.symbol||''))eligible.set(s.baseAsset,s);}
  const uniqueCoins=[],seen=new Set(),symbolCounts=new Map(),records=[];
  for(const c of coins){if(!c||typeof c.id!=='string'||typeof c.symbol!=='string')continue;const id=c.id.toLowerCase();if(seen.has(id))continue;seen.add(id);const base=c.symbol.toUpperCase();symbolCounts.set(base,(symbolCounts.get(base)||0)+1);uniqueCoins.push({c,id,base});}
  for(const {c,id,base} of uniqueCoins){const ambiguous=(symbolCounts.get(base)||0)>1;const contract=ambiguous?null:eligible.get(base);records.push({coingecko_id:id,symbol:base,name:String(c.name||'').slice(0,100),market_cap_rank:Number.isInteger(c.market_cap_rank)?c.market_cap_rank:null,market_cap_usd:Number.isFinite(c.market_cap)?c.market_cap:null,volume_24h_usd:Number.isFinite(c.total_volume)?c.total_volume:null,price_usd:Number.isFinite(c.current_price)?c.current_price:null,price_change_24h_pct:Number.isFinite(c.price_change_percentage_24h)?c.price_change_percentage_24h:null,binance_usdm_demo_perpetual_eligible:Boolean(contract),demo_symbol:contract?contract.symbol:null,contract_status:ambiguous?'ambiguous_coingecko_symbol':contract?'TRADING':'not_listed_or_not_trading'});}
  return {status:'verified',mode:'read_only',execution_enabled:false,page:pageNumber,per_page:count,discovered_count:records.length,eligible_demo_perpetual_count:records.filter(x=>x.binance_usdm_demo_perpetual_eligible).length,sources:[{id:'coingecko_markets',observed_at:new Date().toISOString()},{id:'binance_usdm_futures_demo_exchange_info',observed_at:new Date().toISOString()}],records};
 }catch(error){return {status:'unavailable',reason_code:String(error&&error.message||'provider_failure').replace(/[^a-zA-Z0-9_:-]/g,'_').slice(0,100),execution_enabled:false};}
}
module.exports={discoverCrypto,MAX_COINS};