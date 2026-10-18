'use strict';
const assert = require('node:assert/strict');
const { getRhSnapshot, createRhTask, updateRhTaskStatus, MAX_RESPONSE_BYTES } = require('../../runtime/rh-store.cjs');
const { createServer } = require('../../runtime/server.cjs');

async function main() {
  const requests = [];
  const fakeFetch = async (url, init) => {
    requests.push({url,init});
    if (url.includes('/rh_roles?')) return {ok:true,status:200,async json(){return [{role_key:'risk',label:'Risco',purpose:'Validar limites',permissions:['read','block'],activity_status:'not_reported',updated_at:'2026-10-18T12:00:00Z'}];}};
    if (url.includes('/rh_tasks?')) return {ok:true,status:200,async json(){return [{task_id:'11111111-1111-4111-8111-111111111111',task_key:'RH-TEST-1',title:'Revisar fonte',role_key:'risk',market:'CRYPTO',status:'queued',evidence:{source:'test'},created_at:'2026-10-18T12:00:00Z',updated_at:'2026-10-18T12:00:00Z',completed_at:null}];}};
    if (url.endsWith('/rpc/rh_create_task_with_audit')) return {ok:true,status:200,async json(){return {task_id:'11111111-1111-4111-8111-111111111111',task_key:'RH-TEST-2',title:'Validar feed',role_key:'market_data',market:'CRYPTO',status:'queued'};}};
    if (url.endsWith('/rpc/rh_update_task_status_with_audit')) return {ok:true,status:200,async json(){return {task_id:'11111111-1111-4111-8111-111111111111',task_key:'RH-TEST-2',title:'Validar feed',role_key:'market_data',market:'CRYPTO',status:'completed'};}};
    throw new Error('unexpected_url');
  };
  const env={SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'test-only'};
  const result=await getRhSnapshot({env,fetchImpl:fakeFetch});
  assert.equal(result.status,'verified');
  assert.equal(result.activity_is_real,true);
  assert.equal(result.roles.length,1);
  assert.equal(result.roles[0].activity_status,'not_reported');
  assert.equal(result.tasks[0].task_key,'RH-TEST-1');
  assert.equal(requests.length,2);
  assert.ok(requests.every(x=>x.init.headers['accept-profile']==='adonai_trade'));
  assert.ok(requests.every(x=>x.init.headers.authorization==='Bearer test-only'));
  assert.ok(!JSON.stringify(result).includes('test-only'),'service role key must not be returned');
  const createdTask=await createRhTask({env,fetchImpl:fakeFetch,taskKey:'RH-TEST-2',title:'Validar feed',roleKey:'market_data',market:'CRYPTO',evidence:{source:'contract-test'}});
  assert.equal(createdTask.status,'queued');
  const updatedTask=await updateRhTaskStatus({env,fetchImpl:fakeFetch,taskId:'11111111-1111-4111-8111-111111111111',status:'completed',evidence:{verified:true}});
  assert.equal(updatedTask.status,'completed');
  await assert.rejects(createRhTask({env,fetchImpl:fakeFetch,taskKey:'a!',title:'Valid title',roleKey:'risk'}),/invalid_task_key/);
  await assert.rejects(updateRhTaskStatus({env,fetchImpl:fakeFetch,taskId:'bad',status:'completed'}),/invalid_task_id/);
  const unavailable=await getRhSnapshot({env:{},fetchImpl:fakeFetch});
  assert.equal(unavailable.status,'unavailable');
  assert.deepEqual(unavailable.roles,[]);
  const failed=await getRhSnapshot({env,fetchImpl:async()=>({ok:false,status:403})});
  assert.equal(failed.status,'unavailable');
  const oversizedHeader=await getRhSnapshot({env,fetchImpl:async()=>({ok:true,status:200,headers:{get:(name)=>name==='content-length'?String(MAX_RESPONSE_BYTES+1):null},async json(){throw new Error('oversized response must not be parsed');}})});
  assert.equal(oversizedHeader.status,'unavailable');
  assert.equal(oversizedHeader.reason_code,'supabase_response_too_large');
  const oversizedJson=await getRhSnapshot({env,fetchImpl:async(url)=>({ok:true,status:200,async json(){return url.includes('/rh_roles?')?[{role_key:'risk',payload:'x'.repeat(MAX_RESPONSE_BYTES+1)}]:[];}})});
  assert.equal(oversizedJson.status,'unavailable');
  assert.equal(oversizedJson.reason_code,'supabase_response_too_large');

  const serverEnv={...env,RH_API_TOKEN:'test-rh-token-that-is-at-least-32-chars'};
  const server=createServer({now:()=>Date.parse('2026-10-18T12:00:00Z'),env:serverEnv,auditLedger:null,fetchImpl:fakeFetch});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
    const response=await fetch('http://127.0.0.1:'+server.address().port+'/api/v1/rh');
    assert.equal(response.status,200);
    const body=await response.json();
    assert.equal(body.status,'verified');
    assert.equal(body.execution_enabled,false);
    const unavailableResponse=await fetch('http://127.0.0.1:'+server.address().port+'/api/v1/rh',{headers:{'x-test-unavailable':'1'}});
    assert.equal(unavailableResponse.status,200);
    assert.equal(body.roles.length,1);
    const noAuth=await fetch('http://127.0.0.1:'+server.address().port+'/api/v1/rh/tasks',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({task_key:'RH-HTTP-1',title:'Criar tarefa',role_key:'risk'})});
    assert.equal(noAuth.status,401,'task writes require server-side bearer token');
    const created=await fetch('http://127.0.0.1:'+server.address().port+'/api/v1/rh/tasks',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer test-rh-token-that-is-at-least-32-chars'},body:JSON.stringify({task_key:'RH-HTTP-1',title:'Criar tarefa',role_key:'risk',market:'CRYPTO'})});
    assert.equal(created.status,201);
    const createdBody=await created.json();assert.equal(createdBody.audit_persisted,true);assert.equal(createdBody.execution_enabled,false);
    const patched=await fetch('http://127.0.0.1:'+server.address().port+'/api/v1/rh/tasks/11111111-1111-4111-8111-111111111111/status',{method:'PATCH',headers:{'content-type':'application/json',authorization:'Bearer test-rh-token-that-is-at-least-32-chars'},body:JSON.stringify({status:'completed'})});
    assert.equal(patched.status,200);assert.equal((await patched.json()).audit_persisted,true);
  } finally { await new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve())); }
  process.stdout.write('PASS RH store and HTTP endpoints: persisted reads, audited task RPC, auth-gated writes, invalid input rejection, no secret leakage, paper-only\n');
}
main().catch(error=>{process.stderr.write(String(error.stack||error)+'\n');process.exitCode=1;});
