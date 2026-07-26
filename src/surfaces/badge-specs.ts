import { resolveTiers, type TierTable } from '../domain/tier-table';
import type { Target } from '../game/target';
import type { BadgeSpec } from '../render/badge-layer';

type Label = (resolved: ReturnType<typeof resolveTiers>) => string;

export function badgeSpecsFor(
  targets: readonly Target[],
  table: TierTable,
  label: Label,
): BadgeSpec[] {
  return targets.map((target) => {
    const resolved = resolveTiers(table, target.primary, target.fusion);
    return {
      key: target.key,
      text: label(resolved),
      tier: resolved.bestTier,
      parent: target.parent,
      offset: target.offset,
      scale: target.scale,
    };
  });
}
