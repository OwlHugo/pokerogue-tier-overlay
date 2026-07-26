import type { GameContext } from './game/context';
import type { Surface } from './surfaces/surface';

export class Overlay {
  private readonly active = new Set<Surface>();

  constructor(
    private readonly surfaces: readonly Surface[],
    private readonly readContext: () => GameContext,
  ) {}

  tick(): void {
    const context = this.readContext();

    for (const surface of this.surfaces) {
      if (surface.matches(context)) {
        this.active.add(surface);
        surface.sync(context);
      } else if (this.active.delete(surface)) {
        surface.clear();
      }
    }
  }

  destroy(): void {
    for (const surface of this.active) {
      surface.clear();
    }
    this.active.clear();
  }
}
