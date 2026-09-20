// Logic tests for chemistry helpers and model switching (Node, no dependencies).
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { shells, period, parseSubshells, electronCount, expand } from '../src/data/chemistry.js';
import { ELEMENTS, bySym } from '../src/data/elements.js';
import { MODELS, modelById } from '../src/js/models.js';

test('shells() returns electrons per principal shell', () => {
  assert.deepEqual(shells('1s1'), [1]);
  assert.deepEqual(shells('1s2'), [2]);
  assert.deepEqual(shells('[He] 2s2 2p2'), [2, 4]);        // Carbon
  assert.deepEqual(shells('[Ne] 3s1'), [2, 8, 1]);          // Sodium
  assert.deepEqual(shells('[Ar] 3d6 4s2'), [2, 8, 14, 2]);   // Iron (note M=14)
  assert.deepEqual(shells('[Xe] 4f14 5d10 6s2 6p6'), [2, 8, 18, 32, 18, 8]); // Radon
});

test('period equals highest principal quantum number', () => {
  assert.equal(period('[Rn] 7s1'), 7);
  assert.equal(period('[Xe] 6s2'), 6);
  assert.equal(period('1s1'), 1);
});

test('parseSubshells sorts by n then l and counts electrons', () => {
  const subs = parseSubshells('[Ar] 3d6 4s2');
  const labels = subs.map((s) => s.label);
  assert.ok(labels.includes('3d6') && labels.includes('4s2'), 'expected 3d6 and 4s2');
  assert.equal(subs.reduce((a, s) => a + s.count, 0), 26);
});

test('electronCount matches atomic number for sampled elements', () => {
  for (const sym of ['H', 'O', 'Fe', 'U', 'Og']) {
    const e = bySym(sym);
    assert.equal(electronCount(e.config), e.z);
  }
});

test('expand handles nested noble-gas cores', () => {
  assert.equal(expand('[He] 2s1'), '1s2 2s1');
  assert.equal(expand('[Rn] 7s1').split(' ').length, 16); // Rn core has 15 tokens + 7s1
});

test('model switching default and lookup', () => {
  const bohr = modelById('bohr');
  assert.equal(bohr.kind, 'bohr');
  // Bohr is "exact" only for hydrogen.
  assert.match(bohr.note(bySym('H')), /exact for hydrogen/i);
  assert.match(bohr.note(bySym('C')), /cannot accurately describe/i);
  // Quantum note mentions schematic clouds.
  assert.match(modelById('quantum').note(bySym('Fe')), /probability clouds/i);
});

test('every element resolves a model note without throwing', () => {
  for (const e of ELEMENTS) {
    for (const m of MODELS) {
      assert.doesNotThrow(() => m.note(e));
    }
  }
});
