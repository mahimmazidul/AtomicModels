// Checks the measured production bundle size against the 200 KB compressed
// budget. Skips gracefully if the site has not been built yet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

const ESSENTIAL = [
  'index.html', 'css/styles.css', 'js/app.js', 'js/viz.js', 'js/models.js',
  'js/sw-register.js', 'data/elements.js', 'data/chemistry.js',
  'sw.js', 'manifest.webmanifest'
];

test('essential payload is under the 200 KB compressed budget', { skip: !existsSync(DIST) }, () => {
  let gz = 0;
  for (const f of ESSENTIAL) {
    const p = join(DIST, f);
    assert.ok(existsSync(p), `missing built file: ${f}`);
    gz += gzipSync(readFileSync(p)).length;
  }
  const kb = gz / 1024;
  console.log(`  Essential gzip size: ${kb.toFixed(1)} KB`);
  assert.ok(gz < 200 * 1024, `essential payload ${kb.toFixed(1)} KB exceeds 200 KB`);
});

test('pre-rendered element and model pages exist', { skip: !existsSync(DIST) }, () => {
  const elDir = join(DIST, 'elements');
  const mdDir = join(DIST, 'models');
  assert.ok(existsSync(elDir), 'elements/ directory missing');
  assert.ok(existsSync(mdDir), 'models/ directory missing');
  const elCount = readdirSync(elDir).filter((f) => f.endsWith('.html')).length;
  const mdCount = readdirSync(mdDir).filter((f) => f.endsWith('.html')).length;
  assert.equal(elCount, 118, `expected 118 element pages, found ${elCount}`);
  assert.equal(mdCount, 5, `expected 5 model pages, found ${mdCount}`);
  assert.ok(existsSync(join(DIST, 'sitemap.xml')));
  assert.ok(existsSync(join(DIST, 'robots.txt')));
  assert.ok(existsSync(join(DIST, 'sw.js')));
});
