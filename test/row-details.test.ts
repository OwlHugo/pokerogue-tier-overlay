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

const sceneWith = (over: Parameters<typeof fakePokemon>[0]) =>
  fakeBattleScene({ enemies: [fakePokemon(over)] });

describe('detalhes lidos do runtime', () => {
  test('reune as abilities comuns e a escondida, marcando qual e escondida', () => {
    const scene = sceneWith({
      speciesId: 280,
      name: 'Ralts',
      ability1: 28,
      ability2: 36,
      abilityHidden: 140,
    });

    const abilities = fieldView(scene, tiers, {})[0]?.abilities ?? [];

    expect(abilities.map((a) => a.id)).toEqual([28, 36, 140]);
    expect(abilities.map((a) => a.hidden)).toEqual([false, false, true]);
  });

  test('especie sem hidden ability lista so as comuns', () => {
    const scene = sceneWith({ speciesId: 280, name: 'Ralts', ability1: 28, abilityHidden: 0 });

    const abilities = fieldView(scene, tiers, {})[0]?.abilities ?? [];

    expect(abilities).toHaveLength(1);
    expect(abilities[0]?.hidden).toBe(false);
  });

  test('ability repetida entre comum e escondida entra uma vez so', () => {
    const scene = sceneWith({ speciesId: 280, name: 'Ralts', ability1: 28, abilityHidden: 28 });

    expect(fieldView(scene, tiers, {})[0]?.abilities).toHaveLength(1);
  });

  test('especie sem ability nenhuma devolve lista vazia sem lancar', () => {
    const scene = sceneWith({ speciesId: 280, name: 'Ralts' });

    expect(fieldView(scene, tiers, {})[0]?.abilities).toEqual([]);
  });

  test('traz a catch rate quando o jogo expoe', () => {
    const scene = sceneWith({ speciesId: 280, name: 'Ralts', catchRate: 235 });

    expect(fieldView(scene, tiers, {})[0]?.catchRate).toBe(235);
  });

  test('especie sem catch rate devolve null', () => {
    const scene = sceneWith({ speciesId: 280, name: 'Ralts' });

    expect(fieldView(scene, tiers, {})[0]?.catchRate).toBeNull();
  });

  test('sem set do Smogon nao ha ability recomendada', () => {
    const scene = sceneWith({ speciesId: 280, name: 'Ralts', ability1: 28 });

    expect(fieldView(scene, tiers, {})[0]?.recommendedAbility).toBeNull();
  });
});
