import type { LocaleRef } from '../domain/locale-ref';
import { ratingLabel, ratingOf } from '../domain/rating';
import { baseReachable } from '../domain/reachable';
import type { TierTable } from '../domain/tier-table';
import { resolveTiers } from '../domain/tier-table';
import type { GameContext } from '../game/context';
import type { StarterSelectHandler } from '../game/pokerogue';
import { speciesRefOf } from '../game/species-ref';
import { readStarterTargets } from '../game/starter';
import type { BadgeLayer } from '../render/badge-layer';
import { shortLabel } from '../render/label';
import { badgeSpecsFor } from './badge-specs';

const FOCUS_OFFSET = { x: 55, y: 96 };
const FOCUS_SCALE = 0.26;

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
    private readonly focusLayer: BadgeLayer | null = null,
    private readonly localeRef: LocaleRef = { current: 'pt' },
  ) {}

  private syncFocus(handler: StarterSelectHandler): void {
    const layer = this.focusLayer;
    const alvo = handler.starterSelectContainer;
    const species = handler.lastSpecies;

    if (!layer || !alvo || !species) {
      layer?.clear();
      return;
    }

    const resolved = resolveTiers(this.table, speciesRefOf(species.speciesId, ''), null);
    const alcance = baseReachable(resolved);

    layer.reconcile([
      {
        key: `focus:${species.speciesId}`,
        text: ratingLabel(ratingOf(alcance.tier), this.localeRef.current),
        tier: alcance.tier,
        parent: alvo,
        offset: FOCUS_OFFSET,
        scale: FOCUS_SCALE,
      },
    ]);
  }

  matches(context: GameContext): boolean {
    return context.handlerName === STARTER_SELECT_HANDLER;
  }

  sync(context: GameContext): void {
    const handler = handlerOf(context);
    if (!handler) return;
    this.layer.reconcile(badgeSpecsFor(readStarterTargets(handler), this.table, shortLabel));
    this.syncFocus(handler);
  }

  clear(): void {
    this.layer.clear();
    this.focusLayer?.clear();
  }
}
