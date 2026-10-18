const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const htmlPath = "public/Adonai_Turbo_Real.html";
const html = fs.readFileSync(htmlPath, "utf8");
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);
assert.ok(scriptMatch, "HTML must contain its application script");
new vm.Script(scriptMatch[1], { filename: htmlPath });

for (const [label, pattern] of [
  ["top-level RH tab", /id="rhTabTop"/],
  ["top-level tab event handler", /\$\("#rhTabTop"\)\.addEventListener\("click",\s*\(\)\s*=>\s*\{\s*S\.sel\s*=\s*null;\s*navegar\("rh"\);\s*\}\)/],
  ["RH in side menu", /\["rh",\s*"RH Adonai"\]/],
  ["RH view registration", /rh\(\)\s*\{\s*return rhView\(\);\s*\}/],
  ["RH initialization on navigation", /if\s*\(v\s*===\s*"rh"\)\s*inicializarRH\(\)/],
  ["interactive company selector", /data-rh-company/],
  ["interactive category branches", /data-rh-branch-action/],
  ["interactive agent nodes", /data-rh-agent/],
  ["action controls", /data-rh-action/],
  ["sandbox/review workflow", /Teste em sandbox registrado/],
  ["per-company local log filtering", /x\.empresa===RH_STATE\.empresa/],
  ["no claim of server persistence", /ainda não são enviados ao servidor/]
]) {
  assert.match(html, pattern, label);
}

const agentBlock = html.match(/const RH_AGENTES = \[([\s\S]*?)\n  \];/);
assert.ok(agentBlock, "agent registry must exist");
const agentIds = [...agentBlock[1].matchAll(/\{id:"([^"]+)"/g)].map(m => m[1]);
assert.equal(agentIds.length, 12, "expected 12 logical agent roles");
assert.equal(new Set(agentIds).size, agentIds.length, "agent IDs must be unique");

for (const company of [
  "Adonai Turbo", "Adonai Marketing Digital", "Adonai Finanças",
  "Adonai Lab", "Adonai Trade"
]) assert.ok(html.includes(company), "missing company scope: " + company);

for (const category of [
  "Talentos e recrutamento", "Treinamento e desenvolvimento",
  "Desempenho e carreira", "Pessoas, clima e segurança",
  "Administração e conformidade", "Inteligência e melhoria contínua"
]) assert.ok(html.includes(category), "missing RH category: " + category);

console.log("PASS: HTML JavaScript syntax");
console.log("PASS: RH top tab and side navigation");
console.log("PASS: 12 unique agent roles");
console.log("PASS: five Adonai companies");
console.log("PASS: six RH categories and interactive controls");
console.log("PASS: prototype limits are explicitly disclosed");
