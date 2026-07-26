import { keyFor, type SpeciesKey, type SpeciesRef } from './species-key';
import { compareTier, type Tier } from './tier';

export interface TierEntry {
  tier: Tier | null;
  bestTier: Tier | null;
  bestName: string | null;
  line: readonly string[];
}

export type TierTable = Readonly<Record<SpeciesKey, TierEntry>>;

export interface ResolvedTiers {
  tier: Tier | null;
  bestTier: Tier | null;
  bestName: string | null;
}

const EMPTY: ResolvedTiers = { tier: null, bestTier: null, bestName: null };

function lookup(table: TierTable, ref: SpeciesRef): TierEntry | null {
  return table[keyFor(ref.speciesId, ref.formKey)] ?? table[keyFor(ref.speciesId, '')] ?? null;
}

export function resolveTiers(
  table: TierTable,
  primary: SpeciesRef,
  fusion: SpeciesRef | null,
): ResolvedTiers {
  const first = lookup(table, primary);
  const second = fusion ? lookup(table, fusion) : null;

  if (!first && !second) return EMPTY;
  if (!first) return toResolved(second);
  if (!second) return toResolved(first);

  return compareTier(second.bestTier, first.bestTier) < 0 ? toResolved(second) : toResolved(first);
}

function toResolved(entry: TierEntry | null): ResolvedTiers {
  if (!entry) return EMPTY;
  return { tier: entry.tier, bestTier: entry.bestTier, bestName: entry.bestName };
}
