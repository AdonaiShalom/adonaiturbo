'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { MARKER, plan, install } = require('../../scripts/install-sede3d-menu.cjs');

const original = '<!doctype html><html><head><title>Prototype 3D</title></head><body><canvas id="scene3d"></canvas><script>window.scene3d=true;</script></body></html>';
const result = plan(original);
assert.equal(result.changed, true);
assert.ok(result.html.includes('<canvas id="scene3d"></canvas>'));
assert.ok(result.html.includes('window.scene3d=true;'));
assert.ok(result.html.includes('runtime-bridge.js'));
assert.ok(result.html.includes('sede3d-menu.js'));
assert.ok(result.html.indexOf(MARKER) < result.html.toLowerCase().indexOf('</body>'));
assert.equal(plan(result.html).reason, 'already_installed');
assert.throws(() => plan('<div>not a full document</div>'), /prototype_html_structure_invalid/);

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'adonai-sede3d-installer-'));
try {
  const target = path.join(temp, 'sede3d.html');
  fs.writeFileSync(target, original);
  for (const asset of ['runtime-bridge.js', 'runtime-bridge-client.js', 'sede3d-menu.js']) fs.writeFileSync(path.join(temp, asset), '// fixture');
  const dry = install(target);
  assert.equal(dry.changed, true);
  assert.equal(fs.readFileSync(target, 'utf8'), original, 'dry-run must not modify prototype');
  const written = install(target, { write: true });
  assert.equal(written.changed, true);
  assert.ok(written.backup && fs.existsSync(written.backup), 'backup must exist');
  const installed = fs.readFileSync(target, 'utf8');
  assert.ok(installed.includes(MARKER));
  assert.ok(installed.includes('<canvas id="scene3d"></canvas>'));
  assert.equal(install(target, { write: true }).reason, 'already_installed');
  fs.copyFileSync(written.backup, target);
  assert.equal(fs.readFileSync(target, 'utf8'), original, 'backup must restore exact original bytes');

  const userPrototype = path.join(temp, 'PROTOTIPO_Sede3D_abrir_no_navegador.html');
  fs.writeFileSync(userPrototype, original);
  for (const asset of ['runtime-bridge.js', 'runtime-bridge-client.js', 'sede3d-menu.js']) {
    fs.writeFileSync(path.join(temp, asset), '// fixture');
  }
  assert.equal(install(userPrototype).reason, 'ready_to_install');

  const wrongTarget = path.join(temp, 'trade3d-operacional.html');
  fs.writeFileSync(wrongTarget, original);
  assert.throws(() => install(wrongTarget), /official_sede3d_prototype_required/);
  assert.equal(fs.readFileSync(wrongTarget, 'utf8'), original, 'non-official page must remain untouched');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
process.stdout.write('PASS safe reversible installer; official Sede 3D targets only\n');
