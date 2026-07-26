import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Dex } from '@pkmn/dex';

const tiers = JSON.parse(readFileSync(new URL('../data/tiers.json', import.meta.url)));
const dex = Dex.forGen(9);

// CA-2
test('cobre pelo menos 1000 especies', () => {
  assert.ok(Object.keys(tiers).length >= 1000, `so ${Object.keys(tiers).length} entradas`);
});

// CA-3
test('toda entrada tem tier, bestTier, bestName e line', () => {
  for (const [key, e] of Object.entries(tiers)) {
    assert.ok('tier' in e, `${key} sem tier`);
    assert.ok('bestTier' in e, `${key} sem bestTier`);
    assert.ok('bestName' in e, `${key} sem bestName`);
    assert.ok(Array.isArray(e.line) && e.line.length > 0, `${key} sem line`);
  }
});

// CA-6
test('chaves sao <dex> ou <dex>:<formKey> regional', () => {
  const valid = /^\d+(:(alola|galar|hisui|paldea))?$/;
  for (const key of Object.keys(tiers)) {
    assert.match(key, valid);
  }
});

test('formas regionais tem entrada propria', () => {
  assert.ok(tiers['26:alola'], 'falta Raichu-Alola');
  assert.ok(tiers['58:hisui'], 'falta Growlithe-Hisui');
  assert.equal(tiers['26:alola'].tier, dex.species.get('Raichu-Alola').tier);
});

test('Hoothoot (observado em batalha real) resolve para a linha do Noctowl', () => {
  const e = tiers['163'];
  assert.deepEqual(e.line, ['Hoothoot', 'Noctowl']);
  assert.equal(e.bestTier, dex.species.get('Noctowl').tier);
});

test('tier Illegal vira null em vez de entrar no ranking', () => {
  for (const e of Object.values(tiers)) {
    assert.notEqual(e.tier, 'Illegal');
    assert.notEqual(e.bestTier, 'Illegal');
  }
});
