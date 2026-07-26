import { writeFileSync } from 'node:fs';
import type { Species } from '@pkmn/dex';
import { Dex } from '@pkmn/dex';
import { keyFor, type SpeciesKey } from '../src/domain/species-key';
import { compareTier, normalizeTier, type Tier } from '../src/domain/tier';
import type { TierEntry } from '../src/domain/tier-table';

const REGIONAL_FORMS = new Set(['alola', 'galar', 'hisui', 'paldea']);
const GENERATION = 9;

const dex = Dex.forGen(GENERATION);

function regionOf(species: Species): string {
  if (!species.forme) return '';
  const region = species.forme.split('-')[0]?.toLowerCase() ?? '';
  return REGIONAL_FORMS.has(region) ? region : '';
}

function keyOf(species: Species): SpeciesKey | null {
  if (species.num < 1) return null;
  if (species.forme && !regionOf(species)) return null;
  return keyFor(species.num, regionOf(species));
}

function rootOf(species: Species): Species {
  let current = species;
  while (current.prevo) current = dex.species.get(current.prevo);
  return current;
}

function descendantsOf(species: Species, into: string[]): string[] {
  into.push(species.name);
  for (const evolution of species.evos ?? []) {
    descendantsOf(dex.species.get(evolution), into);
  }
  return into;
}

function entryFor(species: Species): TierEntry {
  const line = descendantsOf(rootOf(species), []);

  let bestTier: Tier | null = null;
  let bestName: string | null = null;

  for (const name of line) {
    const tier = normalizeTier(dex.species.get(name).tier);
    if (tier === null || compareTier(tier, bestTier) >= 0) continue;
    bestTier = tier;
    bestName = name;
  }

  return { tier: normalizeTier(species.tier), bestTier, bestName, line };
}

const table: Record<SpeciesKey, TierEntry> = {};

for (const species of dex.species.all()) {
  const key = keyOf(species);
  if (!key) continue;

  const entry = entryFor(species);
  const existing = table[key];
  if (existing && compareTier(existing.bestTier, entry.bestTier) <= 0) continue;

  table[key] = entry;
}

const source = [
  `import type { TierTable } from '../src/domain/tier-table';`,
  '',
  `export const TIER_TABLE: TierTable = ${JSON.stringify(table)};`,
  '',
].join('\n');

writeFileSync(new URL('../data/tier-table.generated.ts', import.meta.url), source);

const count = Object.keys(table).length;
process.stdout.write(`${count} especies em data/tier-table.generated.ts\n`);
