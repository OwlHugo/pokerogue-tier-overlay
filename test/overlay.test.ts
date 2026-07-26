import { describe, expect, test, vi } from 'vitest';
import type { GameContext } from '../src/game/context';
import { Overlay } from '../src/overlay';
import type { Surface } from '../src/surfaces/surface';

function fakeSurface(name: string, matches: boolean) {
  return {
    name,
    matches: vi.fn<(context: GameContext) => boolean>(() => matches),
    sync: vi.fn<(context: GameContext) => void>(),
    clear: vi.fn<() => void>(),
  } satisfies Surface;
}

const context = {} as GameContext;

describe('Overlay', () => {
  test('sincroniza apenas a surface que reconhece a tela atual', () => {
    const active = fakeSurface('ativa', true);
    const idle = fakeSurface('parada', false);
    const overlay = new Overlay([active, idle], () => context);

    overlay.tick();

    expect(active.sync).toHaveBeenCalledOnce();
    expect(idle.sync).not.toHaveBeenCalled();
  });

  test('limpa a surface que deixou de reconhecer a tela', () => {
    const surface = fakeSurface('alternante', true);
    const overlay = new Overlay([surface], () => context);

    overlay.tick();
    surface.matches.mockReturnValue(false);
    overlay.tick();

    expect(surface.clear).toHaveBeenCalledOnce();
  });

  test('nao limpa quem nunca esteve ativa', () => {
    const surface = fakeSurface('nunca', false);
    const overlay = new Overlay([surface], () => context);

    overlay.tick();
    overlay.tick();

    expect(surface.clear).not.toHaveBeenCalled();
  });

  test('limpa uma unica vez ao sair da tela, mesmo com varios ticks', () => {
    const surface = fakeSurface('alternante', true);
    const overlay = new Overlay([surface], () => context);

    overlay.tick();
    surface.matches.mockReturnValue(false);
    overlay.tick();
    overlay.tick();
    overlay.tick();

    expect(surface.clear).toHaveBeenCalledOnce();
  });

  test('volta a sincronizar quando a tela retorna', () => {
    const surface = fakeSurface('alternante', true);
    const overlay = new Overlay([surface], () => context);

    overlay.tick();
    surface.matches.mockReturnValue(false);
    overlay.tick();
    surface.matches.mockReturnValue(true);
    overlay.tick();

    expect(surface.sync).toHaveBeenCalledTimes(2);
    expect(surface.clear).toHaveBeenCalledOnce();
  });

  test('destroy limpa todas as surfaces ativas', () => {
    const first = fakeSurface('a', true);
    const second = fakeSurface('b', true);
    const overlay = new Overlay([first, second], () => context);

    overlay.tick();
    overlay.destroy();

    expect(first.clear).toHaveBeenCalledOnce();
    expect(second.clear).toHaveBeenCalledOnce();
  });
});
