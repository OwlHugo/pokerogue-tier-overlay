import type { Locale } from '../domain/names';
import type { TierTable } from '../domain/tier-table';
import { readBattleTargets } from '../game/battle';
import type { GameContext } from '../game/context';
import type { BadgeLayer } from '../render/badge-layer';
import { fullLabel } from '../render/label';
import { badgeSpecsFor } from './badge-specs';
import type { Surface } from './surface';

export class BattleSurface implements Surface {
  readonly name = 'battle';

  constructor(
    private readonly layer: BadgeLayer,
    private readonly table: TierTable,
    private readonly locale: Locale = 'pt',
  ) {}

  matches(context: GameContext): boolean {
    return context.scene.currentBattle !== null;
  }

  sync(context: GameContext): void {
    const targets = readBattleTargets(context.scene);
    this.layer.reconcile(
      badgeSpecsFor(targets, this.table, (resolved, nome) =>
        fullLabel(resolved, this.locale, nome),
      ),
    );
  }

  clear(): void {
    this.layer.clear();
  }
}
