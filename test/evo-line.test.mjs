import test from 'node:test';
import assert from 'node:assert/strict';
import { Dex } from '@pkmn/dex';
import { evoLine } from '../src/evo-line.mjs';
import { betterTier } from '../src/tier-rank.mjs';

const dex = Dex.forGen(9);
const line = (name) => evoLine(dex, dex.species.get(name));

// CA-4: asserção relacional. O tier literal do Gyarados muda a cada shift do Smogon;
// o que precisa valer sempre é que Magikarp herda o tier da sua evolução.
test('Magikarp herda o melhor tier da linha, que e o do Gyarados', () => {
  const r = line('Magikarp');
  assert.deepEqual(r.line, ['Magikarp', 'Gyarados']);
  assert.equal(r.bestName, 'Gyarados');
  assert.equal(r.bestTier, dex.species.get('Gyarados').tier);
  assert.equal(betterTier(r.bestTier, dex.species.get('Magikarp').tier), r.bestTier);
});

// CA-5
test('especie sem evolucao tem linha de um elemento e melhor tier igual ao proprio', () => {
  const r = line('Ditto');
  assert.deepEqual(r.line, ['Ditto']);
  assert.equal(r.bestTier, dex.species.get('Ditto').tier);
  assert.equal(r.bestName, 'Ditto');
});

test('linha ramificada cobre todos os ramos a partir de qualquer membro', () => {
  const fromEevee = line('Eevee');
  const fromVaporeon = line('Vaporeon');
  assert.deepEqual(fromVaporeon.line, fromEevee.line);
  assert.equal(fromEevee.line.length, 9);
  for (const n of ['Eevee', 'Vaporeon', 'Sylveon', 'Glaceon']) {
    assert.ok(fromEevee.line.includes(n), `linha deveria conter ${n}`);
  }
});

test('linha sobe do estagio final ate a raiz', () => {
  const r = line('Raichu-Alola');
  assert.ok(r.line.includes('Pichu'));
  assert.ok(r.line.includes('Pikachu'));
  assert.ok(r.line.includes('Raichu-Alola'));
});

test('melhor tier da linha e o melhor entre todos os membros', () => {
  const r = line('Eevee');
  const best = r.line
    .map((n) => dex.species.get(n).tier)
    .reduce((a, b) => betterTier(a, b), null);
  assert.equal(r.bestTier, best);
});

test('tier Illegal na linha nao vira o melhor tier', () => {
  const r = line('Magikarp');
  assert.notEqual(r.bestTier, 'Illegal');
  assert.ok(r.bestTier);
});
