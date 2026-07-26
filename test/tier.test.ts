import { describe, expect, test } from 'vitest';
import { bestOf, compareTier, normalizeTier, TIER_ORDER } from '../src/domain/tier';

describe('compareTier', () => {
  test('ordena do mais forte para o mais fraco', () => {
    expect(compareTier('AG', 'Uber')).toBeLessThan(0);
    expect(compareTier('OU', 'UU')).toBeLessThan(0);
    expect(compareTier('LC', 'OU')).toBeGreaterThan(0);
    expect(compareTier('OU', 'OU')).toBe(0);
  });

  test('trata null como o mais fraco possivel', () => {
    expect(compareTier('LC', null)).toBeLessThan(0);
    expect(compareTier(null, 'LC')).toBeGreaterThan(0);
    expect(compareTier(null, null)).toBe(0);
  });
});

describe('bestOf', () => {
  test('devolve o tier mais forte da lista', () => {
    expect(bestOf(['UU', 'OU', 'LC'])).toBe('OU');
    expect(bestOf(['NFE', 'LC'])).toBe('NFE');
  });

  test('ignora null', () => {
    expect(bestOf([null, 'NU', null])).toBe('NU');
  });

  test('devolve null quando nao ha nenhum tier conhecido', () => {
    expect(bestOf([])).toBeNull();
    expect(bestOf([null, null])).toBeNull();
  });

  test('empate mantem o primeiro', () => {
    expect(bestOf(['RU', 'RU'])).toBe('RU');
  });
});

describe('normalizeTier', () => {
  test('devolve os tiers da ordem canonica inalterados', () => {
    for (const tier of TIER_ORDER) {
      expect(normalizeTier(tier)).toBe(tier);
    }
  });

  test('devolve null para rotulos que o dex usa para o que nao e jogavel', () => {
    expect(normalizeTier('Illegal')).toBeNull();
    expect(normalizeTier('Unreleased')).toBeNull();
    expect(normalizeTier('')).toBeNull();
    expect(normalizeTier(undefined)).toBeNull();
  });

  test('desembrulha a marca de banlist entre parenteses', () => {
    expect(normalizeTier('(OU)')).toBe('OU');
    expect(normalizeTier('(PU)')).toBe('PU');
  });
});
