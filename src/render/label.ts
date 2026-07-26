import { bestReachable } from '../domain/reachable';
import type { ResolvedTiers } from '../domain/tier-table';

const UNKNOWN = '?';

const MARKER = { line: '', mega: '+M', gmax: '+G' } as const;

export function shortLabel(resolved: ResolvedTiers): string {
  const reachable = bestReachable(resolved);
  if (!reachable.tier) return UNKNOWN;
  return `${reachable.tier}${MARKER[reachable.source]}`;
}

export function fullLabel(resolved: ResolvedTiers): string {
  const reachable = bestReachable(resolved);
  if (!reachable.tier) return UNKNOWN;

  const current = resolved.tier ?? UNKNOWN;
  if (current === reachable.tier && reachable.source === 'line') return reachable.tier;

  const via = reachable.name ? ` (${reachable.name})` : '';
  return `${current} \u2192 ${reachable.tier}${via}`;
}
