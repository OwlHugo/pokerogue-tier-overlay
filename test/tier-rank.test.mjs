import test from 'node:test';
import assert from 'node:assert/strict';
import { betterTier, RANK } from '../src/tier-rank.mjs';

test('ranking coloca AG acima de Uber e Uber acima de OU', () => {
  assert.ok(RANK.AG < RANK.Uber);
  assert.ok(RANK.Uber < RANK.OU);
  assert.ok(RANK.OU < RANK.UU);
});

test('betterTier devolve o tier mais alto entre dois conhecidos', () => {
  assert.equal(betterTier('OU', 'UU'), 'OU');
  assert.equal(betterTier('UU', 'OU'), 'OU');
  assert.equal(betterTier('LC', 'AG'), 'AG');
});

test('betterTier ignora null', () => {
  assert.equal(betterTier(null, 'NU'), 'NU');
  assert.equal(betterTier('NU', null), 'NU');
  assert.equal(betterTier(null, null), null);
});

test('tier desconhecido nunca vence um conhecido', () => {
  assert.equal(betterTier('Illegal', 'ZU'), 'ZU');
  assert.equal(betterTier('Unreleased', 'LC'), 'LC');
  assert.equal(betterTier('Illegal', 'Unreleased'), null);
});

test('sufixo de banlist entre parenteses e normalizado', () => {
  assert.equal(betterTier('(OU)', 'UU'), '(OU)');
  assert.equal(betterTier('(PU)', 'NU'), 'NU');
});
