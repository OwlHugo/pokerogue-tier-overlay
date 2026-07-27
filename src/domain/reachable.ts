import { compareTier, type Tier } from './tier';
import type { UnlockedForm } from './tier-table';

export type ReachableSource = 'line' | 'mega' | 'gmax';

export interface Reachable {
  tier: Tier | null;
  name: string | null;
  source: ReachableSource;
}

export interface ReachableInput {
  bestTier: Tier | null;
  bestName: string | null;
  mega: UnlockedForm | null;
  gmax: UnlockedForm | null;
}

export interface Upgrade {
  source: 'mega' | 'gmax';
  tier: Tier;
  name: string;
}

export function baseReachable(entry: ReachableInput): Reachable {
  return { tier: entry.bestTier, name: entry.bestName, source: 'line' };
}

export function upgradesOf(entry: ReachableInput): readonly Upgrade[] {
  const upgrades: Upgrade[] = [];

  for (const [source, form] of [
    ['mega', entry.mega],
    ['gmax', entry.gmax],
  ] as const) {
    if (!form) continue;
    if (entry.bestTier !== null && compareTier(entry.bestTier, form.tier) <= 0) continue;
    upgrades.push({ source, tier: form.tier, name: form.name });
  }

  return upgrades;
}

export function bestReachable(entry: ReachableInput): Reachable {
  let best: Reachable = { tier: entry.bestTier, name: entry.bestName, source: 'line' };

  for (const [source, form] of [
    ['mega', entry.mega],
    ['gmax', entry.gmax],
  ] as const) {
    if (!form) continue;
    if (best.tier !== null && compareTier(best.tier, form.tier) <= 0) continue;
    best = { tier: form.tier, name: form.name, source };
  }

  return best;
}
