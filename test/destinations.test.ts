import { describe, expect, test } from 'vitest';
import type { BiomeTable } from '../src/domain/biome';
import type { TierEntry, TierTable } from '../src/domain/tier-table';
import { destinationsView } from '../src/hud/views';

const entry = (name: string, best: TierEntry['bestTier']): TierEntry => ({
  name,
  tier: 'LC',
  bestTier: best,
  bestName: name,
  mega: null,
  gmax: null,
});

const table: TierTable = {
  '1': entry('Bulbasaur', 'PU'),
  '2': entry('Ivysaur', 'OU'),
  '3': entry('Venusaur', 'ZU'),
  '4': entry('Charmander', 'RU'),
};

const biomes: BiomeTable = {
  1: { name: 'PLAINS', pools: { COMMON: [1] }, links: [2, 9] },
  2: { name: 'GRASS', pools: { COMMON: [1, 3], BOSS: [2] }, links: [] },
  9: { name: 'LAKE', pools: {}, links: [] },
  20: { name: 'DOJO', pools: { COMMON: [4] }, links: [] },
};

describe('destinationsView', () => {
  test('monta um grupo por destino do bioma atual', () => {
    expect(destinationsView(1, biomes, table).map((group) => group.name)).toEqual([
      'GRASS',
      'LAKE',
    ]);
  });

  test('destino sem pool aparece com destaques vazios em vez de sumir', () => {
    expect(destinationsView(1, biomes, table)[1]).toEqual({
      biome: 9,
      name: 'LAKE',
      novos: 0,
      total: 0,
      highlights: [],
    });
  });

  test('bioma sem destino devolve lista vazia', () => {
    expect(destinationsView(2, biomes, table)).toEqual([]);
  });

  test('bioma desconhecido devolve lista vazia sem lancar', () => {
    expect(destinationsView(999, biomes, table)).toEqual([]);
  });

  test('bioma nulo devolve lista vazia sem lancar', () => {
    expect(destinationsView(null, biomes, table)).toEqual([]);
  });

  test('destaques vem ordenados por raridade, do mais raro ao comum', () => {
    const highlights = destinationsView(1, biomes, table)[0]?.highlights ?? [];
    expect(highlights.map((row) => row.rarity)).toEqual(['BOSS', 'COMMON', 'COMMON']);
  });

  test('nao repete a especie que aparece em duas raridades', () => {
    const repetida = {
      1: { name: 'PLAINS', pools: {}, links: [2] },
      2: { name: 'GRASS', pools: { COMMON: [1], BOSS: [1] }, links: [] },
    };
    const grupo = destinationsView(1, repetida, table)[0];
    expect(grupo?.highlights).toHaveLength(1);
    expect(grupo?.total).toBe(1);
  });

  test('esconde o que o jogador ja capturou e conta quantos sobraram', () => {
    const grupo = destinationsView(1, biomes, table, {}, new Set([1, 2]))[0];
    expect(grupo?.highlights.map((row) => row.name)).toEqual(['Venusaur']);
    expect(grupo?.novos).toBe(1);
    expect(grupo?.total).toBe(3);
  });

  test('destino inteiro ja capturado devolve destaques vazios, mas o total continua', () => {
    const grupo = destinationsView(1, biomes, table, {}, new Set([1, 2, 3]))[0];
    expect(grupo?.highlights).toEqual([]);
    expect(grupo?.novos).toBe(0);
    expect(grupo?.total).toBe(3);
  });

  test('link para bioma ausente da tabela nao vira grupo', () => {
    const orfao: BiomeTable = { 1: { name: 'PLAINS', pools: {}, links: [777] } };
    expect(destinationsView(1, orfao, table)).toEqual([]);
  });
});
