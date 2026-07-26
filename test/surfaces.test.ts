import { describe, expect, test } from 'vitest';
import type { TierTable } from '../src/domain/tier-table';
import type { GameContext } from '../src/game/context';
import { BadgeLayer } from '../src/render/badge-layer';
import { BattleSurface } from '../src/surfaces/battle-surface';
import { StarterSurface } from '../src/surfaces/starter-surface';
import type { FakeScene } from './support/fake-phaser';
import { fakeBattleScene, fakePokemon, fakeStarterContainer } from './support/fake-pokerogue';

const table: TierTable = {
  '129': {
    name: 'Magikarp',
    tier: 'LC',
    bestTier: 'RU',
    bestName: 'Gyarados',
    mega: null,
    gmax: null,
  },
  '1': {
    name: 'Bulbasaur',
    tier: 'LC',
    bestTier: 'OU',
    bestName: 'Venusaur',
    mega: null,
    gmax: null,
  },
};

const contextOf = (scene: ReturnType<typeof fakeBattleScene>, handlerName: string | null) =>
  ({ scene, handlerName }) as unknown as GameContext;

describe('BattleSurface', () => {
  test('reconhece a tela quando ha batalha em andamento', () => {
    const scene = fakeBattleScene({ enemies: [fakePokemon({ speciesId: 129, name: 'Magikarp' })] });
    const surface = new BattleSurface(new BadgeLayer(scene), table);

    expect(surface.matches(contextOf(scene, 'CommandUiHandler'))).toBe(true);
  });

  test('nao reconhece a tela de titulo', () => {
    const scene = fakeBattleScene({ enemies: null });
    const surface = new BattleSurface(new BadgeLayer(scene), table);

    expect(surface.matches(contextOf(scene, 'TitleUiHandler'))).toBe(false);
  });

  test('desenha uma badge com o melhor tier da linha do inimigo', () => {
    const scene = fakeBattleScene({ enemies: [fakePokemon({ speciesId: 129, name: 'Magikarp' })] });
    const layer = new BadgeLayer(scene);
    const surface = new BattleSurface(layer, table);

    surface.sync(contextOf(scene, 'CommandUiHandler'));

    expect(layer.size).toBe(1);
    expect(scene.created[0]?.text).toBe('LC → RU (Gyarados)');
  });

  test('marca especie fora da tabela sem inventar tier', () => {
    const scene = fakeBattleScene({
      enemies: [fakePokemon({ speciesId: 99999, name: 'Desconhecido' })],
    });
    const layer = new BadgeLayer(scene);
    new BattleSurface(layer, table).sync(contextOf(scene, 'CommandUiHandler'));

    expect(scene.created[0]?.text).toBe('?');
  });
});

describe('StarterSurface', () => {
  function starterScene(visible: boolean) {
    const scene = fakeBattleScene({ enemies: null });
    const handler = {
      starterContainers: [fakeStarterContainer({ speciesId: 1, name: 'Bulbasaur', visible })],
    };
    scene.ui = { mode: 0, handlers: [handler] };
    Object.defineProperty(handler.constructor, 'name', { value: 'StarterSelectUiHandler' });
    return { scene, handler };
  }

  test('reconhece a tela pelo nome do handler ativo', () => {
    const { scene } = starterScene(true);
    const surface = new StarterSurface(new BadgeLayer(scene as unknown as FakeScene), table);

    expect(surface.matches(contextOf(scene, 'StarterSelectUiHandler'))).toBe(true);
    expect(surface.matches(contextOf(scene, 'CommandUiHandler'))).toBe(false);
  });

  test('marca cada icone visivel com a sigla do melhor tier', () => {
    const { scene } = starterScene(true);
    const layer = new BadgeLayer(scene);
    new StarterSurface(layer, table).sync(contextOf(scene, 'StarterSelectUiHandler'));

    expect(layer.size).toBe(1);
    expect(scene.created[0]?.text).toBe('OU');
  });

  test('nao marca icone escondido pelo filtro', () => {
    const { scene } = starterScene(false);
    const layer = new BadgeLayer(scene);
    new StarterSurface(layer, table).sync(contextOf(scene, 'StarterSelectUiHandler'));

    expect(layer.size).toBe(0);
  });
});
