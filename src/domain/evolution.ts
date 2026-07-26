import { compareTier, type Tier } from './tier';

export interface SpeciesNode {
  name: string;
  prevo?: string;
  evos?: readonly string[];
  tier?: string;
}

export interface SpeciesSource {
  get(name: string): SpeciesNode;
}

export interface BestOfLine {
  bestTier: Tier | null;
  bestName: string | null;
}

function rootOf(source: SpeciesSource, species: SpeciesNode): SpeciesNode {
  let current = species;
  while (current.prevo) current = source.get(current.prevo);
  return current;
}

function collect(source: SpeciesSource, species: SpeciesNode, into: string[]): string[] {
  into.push(species.name);
  for (const evolution of species.evos ?? []) {
    collect(source, source.get(evolution), into);
  }
  return into;
}

export function evolutionLine(source: SpeciesSource, species: SpeciesNode): string[] {
  return collect(source, rootOf(source, species), []);
}

export type TierResolver = (name: string) => Tier | null;

export function bestOfLine(line: readonly string[], tierOf: TierResolver): BestOfLine {
  let bestTier: Tier | null = null;
  let bestName: string | null = null;

  for (const name of line) {
    const tier = tierOf(name);
    if (tier === null || compareTier(tier, bestTier) > 0) continue;
    bestTier = tier;
    bestName = name;
  }

  return { bestTier, bestName };
}
