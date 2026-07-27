import { describe, expect, test } from 'vitest';
import type { TierTable } from '../src/domain/tier-table';
import { fieldView } from '../src/hud/views';
import { fakeBattleScene, fakePokemon } from './support/fake-pokerogue';

const tiers: TierTable = {
  '280': {
    name: 'Ralts',
    tier: 'LC',
    bestTier: 'OU',
    bestName: 'Gardevoir',
    mega: null,
    gmax: null,
  },
};

const abilityNames = { 140: 'Telepathy' };

const sceneWith = (over: Parameters<typeof fakePokemon>[0]) =>
  fakeBattleScene({ enemies: [fakePokemon(over)] });

describe('detalhes lidos do runtime', () => {
  test('resolve a hidden ability pelo id e traz a catch rate', () => {
    const scene = sceneWith({
      speciesId: 280,
      name: 'Ralts',
      abilityHidden: 140,
      catchRate: 235,
    });

    const row = fieldView(scene, tiers, {}, abilityNames)[0];

    expect(row?.hiddenAbility).toBe('Telepathy');
    expect(row?.catchRate).toBe(235);
  });

  test('especie sem hidden ability devolve null em vez de texto de preenchimento', () => {
    const scene = sceneWith({ speciesId: 280, name: 'Ralts', abilityHidden: 0, catchRate: 235 });

    expect(fieldView(scene, tiers, {}, abilityNames)[0]?.hiddenAbility).toBeNull();
  });

  test('id de ability fora da tabela devolve null, sem inventar nome', () => {
    const scene = sceneWith({ speciesId: 280, name: 'Ralts', abilityHidden: 999 });

    expect(fieldView(scene, tiers, {}, abilityNames)[0]?.hiddenAbility).toBeNull();
  });

  test('especie sem catch rate devolve null', () => {
    const scene = sceneWith({ speciesId: 280, name: 'Ralts', abilityHidden: 140 });

    expect(fieldView(scene, tiers, {}, abilityNames)[0]?.catchRate).toBeNull();
  });

  test('sem tabela de nomes a hidden ability some, e o resto da linha continua', () => {
    const scene = sceneWith({
      speciesId: 280,
      name: 'Ralts',
      abilityHidden: 140,
      catchRate: 235,
    });

    const row = fieldView(scene, tiers)[0];

    expect(row?.hiddenAbility).toBeNull();
    expect(row?.catchRate).toBe(235);
    expect(row?.reachTier).toBe('OU');
  });
});
