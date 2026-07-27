import { describe, expect, test } from 'vitest';
import { ALL_RATINGS, ratingColor, ratingLabel, ratingOf } from '../src/domain/rating';
import { TIER_ORDER } from '../src/domain/tier';

describe('ratingOf', () => {
  test('as duas pontas do competitivo viram extremos legiveis', () => {
    expect(ratingOf('AG')).toBe('excepcional');
    expect(ratingOf('ZU')).toBe('fraco');
  });

  test('quem ainda evolui tem nota propria, nao vira fraco', () => {
    expect(ratingOf('LC')).toBe('cresce');
    expect(ratingOf('NFE')).toBe('cresce');
  });

  test('todo tier canonico tem nota', () => {
    for (const tier of TIER_ORDER) expect(ratingOf(tier)).toBeTypeOf('string');
  });

  test('sem tier nao inventa nota', () => {
    expect(ratingOf(null)).toBeNull();
  });
});

describe('ratingLabel', () => {
  test('traduz nos dois idiomas', () => {
    expect(ratingLabel('muitoBom', 'pt')).toBe('Muito bom');
    expect(ratingLabel('muitoBom', 'en')).toBe('Very good');
  });

  test('sem nota mostra interrogacao, como o overlay ja faz com tier', () => {
    expect(ratingLabel(null, 'pt')).toBe('?');
  });
});

describe('escala de cor', () => {
  test('cada nota tem cor propria, sem repeticao', () => {
    const cores = ALL_RATINGS.map((r) => ratingColor(r));
    expect(new Set(cores).size).toBe(cores.length);
  });

  test('sem nota usa cor neutra distinta das notas', () => {
    expect(ALL_RATINGS.map((r) => ratingColor(r))).not.toContain(ratingColor(null));
  });
});
