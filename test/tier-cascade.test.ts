import { describe, expect, test } from 'vitest';
import { type GenerationSource, tierAcrossGenerations } from '../src/domain/tier-cascade';

const generation = (gen: number, tiers: Record<string, string>): GenerationSource => ({
  gen,
  source: {
    get: (name) => ({ name, ...(tiers[name] === undefined ? {} : { tier: tiers[name] }) }),
  },
});

describe('tierAcrossGenerations', () => {
  test('usa a geracao mais recente que conhece a especie', () => {
    const sources = [generation(9, { Pikachu: 'ZU' }), generation(8, { Pikachu: 'PU' })];

    expect(tierAcrossGenerations(sources, 'Pikachu')).toEqual({ tier: 'ZU', gen: 9 });
  });

  test('cai para a geracao anterior quando a especie nao existe na atual', () => {
    const sources = [generation(9, { Caterpie: 'Illegal' }), generation(8, { Caterpie: 'LC' })];

    expect(tierAcrossGenerations(sources, 'Caterpie')).toEqual({ tier: 'LC', gen: 8 });
  });

  test('percorre varias geracoes ate encontrar', () => {
    const sources = [
      generation(9, { Weedle: 'Illegal' }),
      generation(8, { Weedle: 'Illegal' }),
      generation(7, { Weedle: 'LC' }),
    ];

    expect(tierAcrossGenerations(sources, 'Weedle')).toEqual({ tier: 'LC', gen: 7 });
  });

  test('devolve null quando nenhuma geracao cataloga a especie', () => {
    const sources = [generation(9, { X: 'Illegal' }), generation(8, {})];

    expect(tierAcrossGenerations(sources, 'X')).toBeNull();
  });
});
