'use strict';

// Safe, reversible installer for the ORIGINAL Sede 3D HTML.
// Default is dry-run. It never replaces the prototype or its scene.
const fs = require('node:fs');
const path = require('node:path');

const MARKER = '<!-- ADONAI_TRADE_SEDE3D_MENU_V1 -->';
const TAGS = [
  '<script defer src="./runtime-bridge.js"></script>',
  '<script defer src="./runtime-bridge-client.js"></script>',
  '<script defer src="./sede3d-menu.js"></script>',
  '<script>',
  '(function(){',
  "  function mount(){",
  "    if (!window.AdonaiTradeSedeMenu || window.__adonaiTradeMenuMounted) return;",
  "    window.__adonaiTradeMenuMounted = window.AdonaiTradeSedeMenu.mount({runtimeBaseUrl:'http://127.0.0.1:3107'});",
  '  }',
  "  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true});",
  '  else mount();',
  '})();',
  '</script>'
].join('\n');

function plan(html) {
  if (typeof html !== 'string' || !/<html\b/i.test(html) || !/<body\b/i.test(html) || !/<\/body\s*>/i.test(html)) {
    throw new Error('prototype_html_structure_invalid');
  }
  if (html.includes(MARKER)) return { changed: false, html, reason: 'already_installed' };
  const bodyEnd = html.search(/<\/body\s*>/i);
  const updated = html.slice(0, bodyEnd) + '\n' + MARKER + '\n' + TAGS + '\n' + html.slice(bodyEnd);
  return { changed: true, html: updated, reason: 'ready_to_install' };
}

function install(file, options = {}) {
  const target = path.resolve(file);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) throw new Error('prototype_html_not_found');
  const dir = path.dirname(target);
  for (const asset of ['runtime-bridge.js', 'runtime-bridge-client.js', 'sede3d-menu.js']) {
    if (!fs.existsSync(path.join(dir, asset))) throw new Error('required_asset_missing:' + asset);
  }
  const original = fs.readFileSync(target, 'utf8');
  const result = plan(original);
  if (!result.changed || !options.write) return { ...result, target, backup: null };
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const backup = target + '.backup-' + stamp;
  const temporary = target + '.install-tmp-' + process.pid;
  if (fs.existsSync(backup) || fs.existsSync(temporary)) throw new Error('backup_or_temporary_already_exists');
  fs.copyFileSync(target, backup, fs.constants.COPYFILE_EXCL);
  try {
    fs.writeFileSync(temporary, result.html, { encoding: 'utf8', flag: 'wx' });
    fs.renameSync(temporary, target);
  } catch (error) {
    try { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); } catch (_) {}
    try { if (!fs.existsSync(target)) fs.copyFileSync(backup, target, fs.constants.COPYFILE_EXCL); } catch (_) {}
    throw error;
  }
  return { ...result, target, backup };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const target = args.find((arg) => !arg.startsWith('--'));
  if (!target) {
    process.stderr.write('Uso: node scripts/install-sede3d-menu.cjs <caminho-para-prototipo.html> [--write]\n');
    process.exitCode = 2;
  } else {
    try {
      const result = install(target, { write });
      process.stdout.write(JSON.stringify({
        status: result.reason, changed: result.changed, mode: write ? 'write' : 'dry-run',
        target: result.target, backup: result.backup,
        note: result.changed ? 'A cena 3D original é preservada; o menu é anexado antes de </body>.' : 'Nenhuma alteração necessária.'
      }, null, 2) + '\n');
    } catch (error) {
      process.stderr.write(JSON.stringify({ error: error.message }) + '\n');
      process.exitCode = 1;
    }
  }
}

module.exports = Object.freeze({ MARKER, plan, install });
