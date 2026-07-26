import { describe, expect, test, vi } from 'vitest';
import { armCapture } from '../src/game/capture';
import type { PhaserGame, PhaserHost, PhaserNamespace } from '../src/game/phaser';

function fakeNamespace(): PhaserNamespace {
  return {
    Game: { prototype: { boot: vi.fn() } },
    Scenes: { Systems: { prototype: { step: vi.fn() } } },
  };
}

const fakeGame = (): PhaserGame => ({ scene: { getScene: () => null } });

describe('armCapture', () => {
  test('captura pelo passo da scene quando o jogo ja esta rodando', () => {
    const namespace = fakeNamespace();
    const host: PhaserHost = { Phaser: namespace };
    const captured = vi.fn();

    const armed = armCapture(host, captured);
    expect(armed).toContain('patchSceneSystemsStep');

    const game = fakeGame();
    namespace.Scenes.Systems.prototype.step.call({ game });

    expect(captured).toHaveBeenCalledWith({ game, strategy: 'patchSceneSystemsStep' });
  });

  test('restaura o passo original depois de capturar', () => {
    const namespace = fakeNamespace();
    const original = namespace.Scenes.Systems.prototype.step;
    armCapture({ Phaser: namespace }, vi.fn());

    namespace.Scenes.Systems.prototype.step.call({ game: fakeGame() });

    expect(namespace.Scenes.Systems.prototype.step).toBe(original);
    expect(original).toHaveBeenCalledTimes(1);
  });

  test('captura pela atribuicao do namespace quando chega antes do jogo', () => {
    const host: PhaserHost = {};
    const captured = vi.fn();

    const armed = armCapture(host, captured);
    expect(armed).toContain('interceptPhaserAssignment');

    const namespace = fakeNamespace();
    host.Phaser = namespace;

    const game = fakeGame();
    namespace.Game.prototype.boot.call(game);

    expect(captured).toHaveBeenCalledWith({ game, strategy: 'interceptPhaserAssignment' });
  });

  test('o namespace atribuido continua legivel pelo jogo', () => {
    const host: PhaserHost = {};
    armCapture(host, vi.fn());

    const namespace = fakeNamespace();
    host.Phaser = namespace;

    expect(host.Phaser).toBe(namespace);
  });

  test('o boot original do jogo continua sendo chamado', () => {
    const host: PhaserHost = {};
    armCapture(host, vi.fn());

    const namespace = fakeNamespace();
    const original = namespace.Game.prototype.boot;
    host.Phaser = namespace;

    namespace.Game.prototype.boot.call(fakeGame());

    expect(original).toHaveBeenCalledTimes(1);
  });

  test('captura uma vez so, mesmo com as duas estrategias armadas', () => {
    const namespace = fakeNamespace();
    const host: PhaserHost = { Phaser: namespace };
    const captured = vi.fn();

    armCapture(host, captured);
    const game = fakeGame();
    namespace.Scenes.Systems.prototype.step.call({ game });
    namespace.Scenes.Systems.prototype.step.call({ game });

    expect(captured).toHaveBeenCalledTimes(1);
  });
});
