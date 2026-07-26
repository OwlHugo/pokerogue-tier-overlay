import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// overlay.js e injetado como texto na pagina, entao nao usa import/export.
// Aqui ele e avaliado no globalThis do node, onde `window` nao existe — o que garante
// que o hook e o loop de render nao disparam durante o teste.
new Function(readFileSync(new URL('../src/overlay.js', import.meta.url), 'utf8'))();
const { extractEnemies, resolve } = globalThis.__tierOverlay;

const tiers = JSON.parse(readFileSync(new URL('../data/tiers.json', import.meta.url)));

// Shape copiado do que foi capturado ao vivo em pokerogue.net (Hoothoot, wave 1).
const mon = (speciesId, name, { formIndex = 0, forms = [], fusion = null } = {}) => ({
  species: { speciesId, name, forms },
  formIndex,
  fusionSpecies: fusion ? { speciesId: fusion.speciesId, name: fusion.name, forms: [] } : null,
  fusionFormIndex: 0,
});

const scene = (enemies) => ({
  currentBattle: enemies ? { enemyParty: enemies, double: enemies.length > 1 } : null,
  getEnemyField: () => enemies ?? [],
});

// CA-9
test('sem batalha ativa nao retorna inimigos', () => {
  assert.deepEqual(extractEnemies(scene(null)), []);
  assert.deepEqual(extractEnemies(null), []);
  assert.deepEqual(extractEnemies(undefined), []);
});

// CA-8
test('extrai o inimigo em campo com os campos usados pelo lookup', () => {
  const r = extractEnemies(scene([mon(163, 'Hoothoot')]));
  assert.equal(r.length, 1);
  assert.equal(r[0].speciesId, 163);
  assert.equal(r[0].name, 'Hoothoot');
  assert.equal(r[0].formIndex, 0);
  assert.equal(r[0].fusion, null);
});

test('batalha dupla retorna os dois inimigos', () => {
  const r = extractEnemies(scene([mon(163, 'Hoothoot'), mon(129, 'Magikarp')]));
  assert.equal(r.length, 2);
});

test('resolve devolve o melhor tier da linha evolutiva', () => {
  const [m] = extractEnemies(scene([mon(163, 'Hoothoot')]));
  const r = resolve(m, tiers);
  assert.equal(r.name, 'Hoothoot');
  assert.equal(r.tier, tiers['163'].tier);
  assert.equal(r.bestTier, tiers['163'].bestTier);
  assert.equal(r.bestName, tiers['163'].bestName);
});

// CA-10
test('fusao usa o melhor tier entre as duas linhas', () => {
  const [m] = extractEnemies(
    scene([mon(10, 'Caterpie', { fusion: { speciesId: 129, name: 'Magikarp' } })]),
  );
  const r = resolve(m, tiers);
  assert.equal(r.name, 'Caterpie/Magikarp');
  assert.equal(r.bestTier, tiers['129'].bestTier); // Gyarados supera a linha do Caterpie
  assert.equal(r.bestName, tiers['129'].bestName);
});

test('forma regional usa a entrada propria da forma', () => {
  const [m] = extractEnemies(
    scene([mon(26, 'Raichu', { formIndex: 1, forms: [{ formKey: '' }, { formKey: 'alola' }] })]),
  );
  const r = resolve(m, tiers);
  assert.equal(r.tier, tiers['26:alola'].tier);
});

test('forma sem entrada propria cai para a especie base', () => {
  const [m] = extractEnemies(
    scene([mon(163, 'Hoothoot', { formIndex: 1, forms: [{ formKey: '' }, { formKey: 'gigantamax' }] })]),
  );
  const r = resolve(m, tiers);
  assert.equal(r.tier, tiers['163'].tier);
});

test('especie desconhecida mostra interrogacao em vez de inventar tier', () => {
  const [m] = extractEnemies(scene([mon(99999, 'Missingno')]));
  const r = resolve(m, tiers);
  assert.equal(r.tier, '?');
  assert.equal(r.bestTier, '?');
});
