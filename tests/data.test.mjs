// Element-data integrity tests (Node, no dependencies).
// Run with: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { ELEMENTS, BY_SYM } from '../src/data/elements.js';
import { electronCount, shells, period, parseSubshells, expand } from '../src/data/chemistry.js';
import { MODELS, modelById } from '../src/js/models.js';

const CATS = new Set([
  'alkali', 'alkaline', 'transition', 'post', 'metalloid',
  'nonmetal', 'halogen', 'noble', 'lanthanide', 'actinide', 'unknown'
]);

test('contains exactly 118 elements with sequential atomic numbers', () => {
  assert.equal(ELEMENTS.length, 118);
  for (let i = 0; i < ELEMENTS.length; i++) {
    assert.equal(ELEMENTS[i].z, i + 1, `element at index ${i} should have z=${i + 1}`);
  }
});

test('symbols and names are unique and well-formed', () => {
  const syms = new Set(), names = new Set();
  for (const e of ELEMENTS) {
    assert.match(e.sym, /^[A-Z][a-z]?$/, `bad symbol ${e.sym}`);
    assert.ok(e.name && e.name.length > 1, `bad name for ${e.sym}`);
    assert.ok(!syms.has(e.sym), `duplicate symbol ${e.sym}`);
    assert.ok(!names.has(e.name), `duplicate name ${e.name}`);
    syms.add(e.sym); names.add(e.name);
  }
});

test('electron configuration parses and matches atomic number', () => {
  for (const e of ELEMENTS) {
    const n = electronCount(e.config);
    assert.equal(n, e.z, `${e.sym}: config electrons (${n}) != Z (${e.z})`);
    const sh = shells(e.config);
    const sum = sh.reduce((a, b) => a + b, 0);
    assert.equal(sum, e.z, `${e.sym}: shells sum (${sum}) != Z (${e.z})`);
    assert.equal(sh.length, period(e.config), `${e.sym}: shell count != period`);
  }
});

test('noble-gas shorthand expands correctly', () => {
  assert.equal(expand('[He] 2s1'), '1s2 2s1');
  // Xenon core stops at 5p6 (no 4f/5d/6s — those belong to the next shells).
  assert.equal(expand('[Xe] 6s1'), '1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 6s1');
});

test('representative isotope is explicit and yields a valid neutron count', () => {
  for (const e of ELEMENTS) {
    assert.ok(Number.isInteger(e.iso) && e.iso >= e.z, `${e.sym}: iso ${e.iso} < Z ${e.z}`);
    const neutrons = e.iso - e.z;
    assert.ok(neutrons >= 0, `${e.sym}: negative neutrons`);
    assert.ok(Number.isInteger(neutrons));
  }
});

test('category is from the known set', () => {
  for (const e of ELEMENTS) assert.ok(CATS.has(e.cat), `unknown category ${e.cat} for ${e.sym}`);
});

test('atomic weight is a numeric or bracketed string', () => {
  for (const e of ELEMENTS) {
    assert.match(e.mass, /^\d+(\.\d+)?$|^\[\d+\]$/, `bad mass for ${e.sym}: ${e.mass}`);
  }
});

test('known electron-config anomalies are present', () => {
  // A sample of elements with anomalous ground states.
  for (const [sym, cfg] of [['Cr', '[Ar] 3d5 4s1'], ['Cu', '[Ar] 3d10 4s1'], ['Pt', '[Xe] 4f14 5d9 6s1'], ['Au', '[Xe] 4f14 5d10 6s1']]) {
    assert.equal(BY_SYM.get(sym).config, cfg, `${sym} config mismatch`);
  }
});

test('all five models produce non-empty notes for every element', () => {
  for (const m of MODELS) {
    assert.ok(m.principle && m.significance && m.limitation, `${m.id} missing prose`);
    for (const e of ELEMENTS) {
      const note = m.note(e);
      assert.ok(typeof note === 'string' && note.length > 20, `${m.id} note empty for ${e.sym}`);
    }
  }
});

test('modelById returns a model and a sensible default', () => {
  assert.equal(modelById('quantum').id, 'quantum');
  assert.equal(modelById('nonsense').id, 'bohr'); // default
});
