import type { Locale } from '../domain/names';
import { ratingLabel, ratingOf, ratingShort } from '../domain/rating';
import { baseReachable, upgradesOf } from '../domain/reachable';
import type { ResolvedTiers } from '../domain/tier-table';

const UNKNOWN = '?';

const MARKER = { mega: '+M', gmax: '+G' } as const;

export function shortLabel(resolved: ResolvedTiers): string {
  const base = baseReachable(resolved);
  if (!base.tier) return UNKNOWN;

  const upgrades = upgradesOf(resolved);
  const marcador = upgrades.map((u) => MARKER[u.source]).join('');

  return `${ratingShort(ratingOf(base.tier))}${marcador}`;
}

export function fullLabel(resolved: ResolvedTiers, locale: Locale, atual: string): string {
  const base = baseReachable(resolved);
  if (!base.tier) return UNKNOWN;

  const nota = ratingLabel(ratingOf(base.tier), locale);
  const via = base.name && base.name !== atual ? base.name : null;

  return via ? `${nota} \u2192 ${via}` : nota;
}
