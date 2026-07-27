import { describe, expect, test } from 'vitest';
import type { BiomeTable } from '../src/domain/biome';
import type { TierTable } from '../src/domain/tier-table';
import { biomeView, fieldView, partyView } from '../src/hud/views';
import { fakeBattleScene, fakePokemon } from './support/fake-pokerogue';

const tiers: TierTable = {
  '129': {
    name: 'Magikarp',
    tier: 'LC',
    bestTier: 'RU',
    bestName: 'Gyarados',
    mega: null,
    gmax: null,
  },
  '303': {
    name: 'Mawile',
    tier: 'ZU',
    bestTier: 'ZU',
    bestName: 'Mawile',
    mega: { tier: 'OU', name: 'Mawile-Mega' },
    gmax: null,
  },
  '163': {
    name: 'Hoothoot',
    tier: 'LC',
    bestTier: 'ZU',
    bestName: 'Noctowl',
    mega: null,
    gmax: null,
  },
};

const biomes: BiomeTable = {
  9: { name: 'LAKE', pools: { COMMON: [129], BOSS: [303] }, links: [] },
};

describe('fieldView', () => {
  test('lista os inimigos em campo com o alcance de tier', () => {
    const scene = fakeBattleScene({
      enemies: [fakePokemon({ speciesId: 303, name: 'Mawile' })],
    });

    const rows = fieldView(scene, tiers);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ name: 'Mawile', tier: 'ZU', reachTier: 'OU', source: 'mega' });
  });

  test('sem batalha, nao ha nada em campo', () => {
    expect(fieldView(fakeBattleScene({ enemies: null }), tiers)).toEqual([]);
  });
});

describe('partyView', () => {
  test('lista o time do jogador, nao os inimigos', () => {
    const scene = fakeBattleScene({ enemies: [fakePokemon({ speciesId: 163, name: 'Hoothoot' })] });
    scene.party = [fakePokemon({ speciesId: 129, name: 'Magikarp' })];

    const rows = partyView(scene, tiers);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ name: 'Magikarp', reachTier: 'RU' });
  });

  test('time vazio nao quebra', () => {
    const scene = fakeBattleScene({ enemies: null });
    scene.party = [];
    expect(partyView(scene, tiers)).toEqual([]);
  });
});

describe('biomeView', () => {
  test('lista o bioma inteiro numa lista so, com o melhor alcance no topo', () => {
    const groups = biomeView(9, biomes, tiers);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.entries[0]).toMatchObject({ name: 'Mawile', reachTier: 'OU' });
  });

  test('nao repete a especie que aparece em duas raridades', () => {
    const repetido: BiomeTable = {
      9: { name: 'LAKE', pools: { COMMON: [129], BOSS: [129] }, links: [] },
    };

    expect(biomeView(9, repetido, tiers)[0]?.entries).toHaveLength(1);
  });

  test('bioma desconhecido devolve lista vazia em vez de inventar', () => {
    expect(biomeView(999, biomes, tiers)).toEqual([]);
  });

  test('ordena cada grupo pelo melhor tier alcancavel', () => {
    const table: BiomeTable = {
      1: { name: 'PLAINS', pools: { COMMON: [163, 303, 129] }, links: [] },
    };
    const [group] = biomeView(1, table, tiers);

    expect(group?.entries.map((e) => e.name)).toEqual(['Mawile', 'Magikarp', 'Hoothoot']);
  });
});
