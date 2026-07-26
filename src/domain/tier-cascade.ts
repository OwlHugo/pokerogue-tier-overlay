import type { SpeciesSource } from './evolution';
import { normalizeTier, type Tier } from './tier';

export interface GenerationSource {
  gen: number;
  source: SpeciesSource;
}

export interface TierOrigin {
  tier: Tier;
  gen: number;
}

export function tierAcrossGenerations(
  sources: readonly GenerationSource[],
  name: string,
): TierOrigin | null {
  for (const { gen, source } of sources) {
    const tier = normalizeTier(source.get(name).tier);
    if (tier) return { tier, gen };
  }
  return null;
}
