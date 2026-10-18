'use strict';
const assert = require('node:assert/strict');
const { getRhSnapshot } = require('../../runtime/rh-store.cjs');
const { createServer } = require('../../runtime/server.cjs');

async function main() {
  const requests = [];
  const fakeFetch = async (url, init) => {
    requests.push({url,init});
    if (url.includes('/rh_roles?')) return {ok:true,status:200,async json(){return [{role_key:'risk',label:'Risco',purpose:'Validar limites',permissions:['read','block'],activity_status:'not_reported',updated_at:'2026-10-18T12:00:00Z'}];}};
    if (url.includes('/rh_tasks?')) return {ok:true,status:200,async json(){return [{task_id:'11111111-1111-4111-8111-111111111111',task_key:'RH-TEST-1',title:'Revisar fonte',role_key:'risk',market:'CRYPTO',status:'queued',evidence:{source:'test'},created_at:'2026-10-18T12:00:00Z',updated_at:'2026-10-18T12:00:00Z',completed_at:null}];}};
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
  const unavailable=await getRhSnapshot({env:{},fetchImpl:fakeFetch});
  assert.equal(unavailable.status,'unavailable');
  assert.deepEqual(unavailable.roles,[]);
  const failed=await getRhSnapshot({env,fetchImpl:async()=>({ok:false,status:403})});
  assert.equal(failed.status,'unavailable');

  const server=createServer({now:()=>Date.parse('2026-10-18T12:00:00Z'),env,auditLedger:null,fetchImpl:fakeFetch});
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
  } finally { await new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve())); }
  process.stdout.write('PASS RH store and HTTP endpoint: real Supabase profile, persisted roles/tasks, unavailable/fail-closed state, no secret leakage, paper-only\n');
}
main().catch(error=>{process.stderr.write(String(error.stack||error)+'\n');process.exitCode=1;});
