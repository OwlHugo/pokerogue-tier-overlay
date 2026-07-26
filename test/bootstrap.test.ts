import { describe, expect, test, vi } from 'vitest';
import { startOverlay } from '../src/bootstrap';
import type { TierTable } from '../src/domain/tier-table';
import type { PhaserGame } from '../src/game/phaser';
import { fakeBattleScene, fakePokemon } from './support/fake-pokerogue';

const table: TierTable = {
  '129': { tier: 'LC', bestTier: 'RU', bestName: 'Gyarados', mega: null, gmax: null },
};

function fakeGame(scene: unknown): PhaserGame {
  return { scene: { getScene: () => scene } };
}

describe('startOverlay', () => {
  test('espera a scene de batalha existir antes de desenhar', () => {
    const game = fakeGame(null);
    const runner = startOverlay(game, table);

    expect(() => runner.tick()).not.toThrow();
    expect(runner.started).toBe(false);
  });

  test('comeca a desenhar assim que a scene aparece', () => {
    const scene = fakeBattleScene({ enemies: [fakePokemon({ speciesId: 129, name: 'Magikarp' })] });
    const runner = startOverlay(fakeGame(scene), table);

    runner.tick();

    expect(runner.started).toBe(true);
    expect(scene.created).toHaveLength(1);
  });

  test('nao reconstroi o overlay a cada tick', () => {
    const scene = fakeBattleScene({ enemies: [fakePokemon({ speciesId: 129, name: 'Magikarp' })] });
    const runner = startOverlay(fakeGame(scene), table);

    runner.tick();
    runner.tick();
    runner.tick();

    expect(scene.created).toHaveLength(1);
  });

  test('destroy interrompe o desenho', () => {
    const scene = fakeBattleScene({ enemies: [fakePokemon({ speciesId: 129, name: 'Magikarp' })] });
    const runner = startOverlay(fakeGame(scene), table);

    runner.tick();
    runner.destroy();

    expect(scene.created[0]?.destroyed).toBe(true);
  });

  test('sobrevive a uma scene que some depois de aparecer', () => {
    const scene = fakeBattleScene({ enemies: [fakePokemon({ speciesId: 129, name: 'Magikarp' })] });
    const getScene = vi.fn<() => unknown>(() => scene);
    const runner = startOverlay({ scene: { getScene } }, table);

    runner.tick();
    getScene.mockReturnValue(null);

    expect(() => runner.tick()).not.toThrow();
  });
});
