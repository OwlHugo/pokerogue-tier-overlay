import type { PhaserGame, PhaserHost, PhaserNamespace } from './phaser';

export interface CaptureResult {
  game: PhaserGame;
  strategy: string;
}

type Capture = (result: CaptureResult) => void;

function patchSceneSystemsStep(namespace: PhaserNamespace, capture: Capture): void {
  const systems = namespace.Scenes.Systems.prototype;
  const original = systems.step;

  systems.step = function step(this: { game: PhaserGame }, ...args) {
    systems.step = original;
    capture({ game: this.game, strategy: 'patchSceneSystemsStep' });
    return original.apply(this, args);
  };
}

function patchGameBoot(namespace: PhaserNamespace, capture: Capture): void {
  const games = namespace.Game.prototype;
  const original = games.boot;

  games.boot = function boot(this: PhaserGame, ...args) {
    games.boot = original;
    capture({ game: this, strategy: 'interceptPhaserAssignment' });
    return original.apply(this, args);
  };
}

function interceptPhaserAssignment(host: PhaserHost, capture: Capture): void {
  let namespace: PhaserNamespace | undefined;

  Object.defineProperty(host, 'Phaser', {
    configurable: true,
    get: () => namespace,
    set(value: PhaserNamespace) {
      namespace = value;
      patchGameBoot(value, capture);
    },
  });
}

export function armCapture(host: PhaserHost, onCaptured: Capture): string[] {
  let done = false;
  const capture: Capture = (result) => {
    if (done) return;
    done = true;
    onCaptured(result);
  };

  if (host.Phaser) {
    patchSceneSystemsStep(host.Phaser, capture);
    return ['patchSceneSystemsStep'];
  }

  interceptPhaserAssignment(host, capture);
  return ['interceptPhaserAssignment'];
}
