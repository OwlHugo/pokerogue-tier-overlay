import type { Locale } from '../domain/names';
import { ratingLabel, ratingOf } from '../domain/rating';
import { bestReachable } from '../domain/reachable';
import type { ResolvedTiers } from '../domain/tier-table';

const UNKNOWN = '?';

const MARKER = { line: '', mega: '+M', gmax: '+G' } as const;

export function shortLabel(resolved: ResolvedTiers): string {
  const reachable = bestReachable(resolved);
  if (!reachable.tier) return UNKNOWN;
  return `${reachable.tier}${MARKER[reachable.source]}`;
}

export function fullLabel(resolved: ResolvedTiers, locale: Locale, atual: string): string {
  const reachable = bestReachable(resolved);
  if (!reachable.tier) return UNKNOWN;

  const nota = ratingLabel(ratingOf(reachable.tier), locale);
  const via = reachable.name && reachable.name !== atual ? reachable.name : null;

  return via ? `${nota} \u2192 ${via}` : nota;
}
