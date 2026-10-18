'use strict';
const assert = require('node:assert/strict');
const { readState, normalize } = require('../../public/runtime-bridge.js');
async function main() {
 const requests=[];
 const fakeFetch=async(url)=>{
  requests.push(url);
  if(url.endsWith('/api/v1/markets')) return {ok:true,status:200,json:async()=>({timestamp:'2026-10-18T15:00:00.000Z',data_status:'partially_configured',desks:[{id:'CRYPTO',label:'Cripto',provider:'binance_spot_public',provider_configured:true,quote_status:'not_checked',data_mode:'read_only_quote_adapter',execution_enabled:false},{id:'FOREX',label:'Forex',provider:'frankfurter_ecb_daily_reference',provider_configured:true,quote_status:'not_checked',data_mode:'daily_reference_not_intraday',execution_enabled:false}]})};
  if(url.endsWith('/api/v1/integrations')) return {ok:true,status:200,json:async()=>({timestamp:'2026-10-18T15:00:01.000Z',integrations:[{id:'levi',status:'not_verified',configured:true,authenticated:false,execution_enabled:false}]})};
  throw new Error('unexpected_url');
 };
 const state=await readState({baseUrl:'http://127.0.0.1:3100/',fetchImpl:fakeFetch});
 assert.deepEqual(requests.sort(),['http://127.0.0.1:3100/api/v1/integrations','http://127.0.0.1:3100/api/v1/markets']);
 assert.equal(state.mode,'paper'); assert.equal(state.executionEnabled,false); assert.equal(state.desks.length,2);
 assert.equal(state.runtimeTimestamps.markets,'2026-10-18T15:00:00.000Z');
 assert.equal(state.runtimeTimestamps.integrations,'2026-10-18T15:00:01.000Z');
 assert.ok(typeof state.fetchedAt === 'string');
 assert.equal(Object.hasOwn(state,'generatedAt'),false);
 assert.equal(state.desks[0].probability,null); assert.equal(state.desks[0].activity,'not_reported_by_runtime');
 assert.equal(state.integrations[0].authenticated,false); assert.equal(state.evidencePolicy.probabilitiesAvailable,false);
 assert.equal(state.evidencePolicy.teamActivityAvailable,false); assert.ok(state.desks.every(d=>d.executionEnabled===false));
 assert.throws(()=>normalize({desks:[]},{integrations:null}),/runtime_contract_mismatch/);
 await assert.rejects(readState({fetchImpl:async()=>({ok:false,status:503})}),/runtime_http_503/);
 await assert.rejects(readState({timeoutMs:99,fetchImpl:fakeFetch}),/invalid_runtime_timeout/);
 await assert.rejects(readState({baseUrl:'http://runtime.test',timeoutMs:100,fetchImpl:async(_url,init)=>new Promise((_resolve,reject)=>init.signal.addEventListener('abort',()=>reject(new Error('aborted')),{once:true}))}),/runtime_timeout/);
 console.log('3D runtime bridge contract: PASS (read-only; no invented activity/probabilities)');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
