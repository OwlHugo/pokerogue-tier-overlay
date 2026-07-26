import type { ResolvedTiers } from '../domain/tier-table';

const UNKNOWN = '?';

export function shortLabel(resolved: ResolvedTiers): string {
  return resolved.bestTier ?? UNKNOWN;
}

export function fullLabel(resolved: ResolvedTiers): string {
  if (!resolved.bestTier) return UNKNOWN;

  const current = resolved.tier ?? UNKNOWN;
  if (resolved.tier === resolved.bestTier) return resolved.bestTier;

  const evolution = resolved.bestName ? ` (${resolved.bestName})` : '';
  return `${current} → ${resolved.bestTier}${evolution}`;
}
