import type { TierTable } from '../domain/tier-table';
import type { GameContext } from '../game/context';
import type { StarterSelectHandler } from '../game/pokerogue';
import { readStarterTargets } from '../game/starter';
import type { BadgeLayer } from '../render/badge-layer';
import { shortLabel } from '../render/label';
import { badgeSpecsFor } from './badge-specs';
import type { Surface } from './surface';

export const STARTER_SELECT_HANDLER = 'StarterSelectUiHandler';

function handlerOf(context: GameContext): StarterSelectHandler | null {
  const ui = context.scene.ui;
  const handler = ui.handlers[ui.mode] as StarterSelectHandler | undefined;
  return handler?.starterContainers ? handler : null;
}

export class StarterSurface implements Surface {
  readonly name = 'starter-select';

  constructor(
    private readonly layer: BadgeLayer,
    private readonly table: TierTable,
  ) {}

  matches(context: GameContext): boolean {
    return context.handlerName === STARTER_SELECT_HANDLER;
  }

  sync(context: GameContext): void {
    const handler = handlerOf(context);
    if (!handler) return;
    this.layer.reconcile(badgeSpecsFor(readStarterTargets(handler), this.table, shortLabel));
  }

  clear(): void {
    this.layer.clear();
  }
}
