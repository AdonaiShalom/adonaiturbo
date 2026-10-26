'use strict';
const crypto=require('node:crypto');
const MAX_BATCH=10000;
const SIDES=new Set(['LONG','SHORT']);
function stableId(x){return crypto.createHash('sha256').update([String(x.instrument||'').toUpperCase(),x.side||'',x.observed_at||'',x.strategy_version||''].join('|')).digest('hex');}
function evaluateBatch(items,{nowMs=Date.now(),maxAgeMs=120000}={}){
 if(!Array.isArray(items))throw new TypeError('items_must_be_array');
 if(items.length>MAX_BATCH)throw new RangeError('batch_limit_exceeded');
 const seen=new Set(),records=[];
 for(const x of items){let reason=null,id=null;
  if(!x||typeof x!=='object'||Array.isArray(x))reason='candidate_not_object';
  else {id=stableId(x);if(seen.has(id))reason='duplicate_evaluation';else seen.add(id);
   if(!reason&&(!/^[A-Z0-9]{5,20}$/i.test(String(x.instrument||''))))reason='invalid_instrument';
   if(!reason&&!SIDES.has(x.side))reason='invalid_side';
   if(!reason&&(!x.provider||!String(x.provider).trim()))reason='provider_missing';
   if(!reason&&(!x.strategy_version||!String(x.strategy_version).trim()))reason='strategy_version_missing';
   const t=Date.parse(x.observed_at);
   if(!reason&&!Number.isFinite(t))reason='timestamp_invalid';
   if(!reason&&t>nowMs)reason='timestamp_in_future';
   if(!reason&&nowMs-t>maxAgeMs)reason='data_stale';
   for(const k of ['price','volume','spread_bps','volatility_pct','expected_return_pct'])if(!reason&&!Number.isFinite(x[k]))reason='invalid_'+k;
   if(!reason&&(x.price<=0||x.volume<0||x.spread_bps<0||x.volatility_pct<0))reason='invalid_market_metrics';
   if(!reason&&x.contract_verified!==true)reason='demo_contract_not_verified';
  }
  if(reason){records.push({evaluation_id:id,status:'excluded',reason_code:reason});continue;}
  const score=Number((x.expected_return_pct-x.spread_bps/100-x.volatility_pct*.25).toFixed(8));
  records.push({evaluation_id:id,status:'evaluated',instrument:x.instrument.toUpperCase(),side:x.side,provider:x.provider,observed_at:new Date(Date.parse(x.observed_at)).toISOString(),strategy_version:x.strategy_version,metrics:{price:x.price,volume:x.volume,spread_bps:x.spread_bps,volatility_pct:x.volatility_pct,expected_return_pct:x.expected_return_pct,baseline_score_pct:score},score_method:'expected_return_pct - spread_bps/100 - volatility_pct*0.25',execution_enabled:false});
 }
 const evaluated=records.filter(x=>x.status==='evaluated');
 const finalists=evaluated.filter(x=>x.metrics.baseline_score_pct>0).sort((a,b)=>b.metrics.baseline_score_pct-a.metrics.baseline_score_pct).slice(0,5);
 return {schema_version:'1.0.0',mode:'read_only',execution_enabled:false,requested_count:items.length,valid_distinct_evaluations:evaluated.length,excluded_count:records.length-evaluated.length,target_reached:evaluated.length>=MAX_BATCH,records,finalists};
}
module.exports={evaluateBatch,MAX_BATCH,stableId};