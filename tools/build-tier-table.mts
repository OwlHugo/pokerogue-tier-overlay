import { writeFileSync } from 'node:fs';
import type { Species } from '@pkmn/dex';
import { Dex } from '@pkmn/dex';
import { bestOfLine, reachableLine, type SpeciesSource } from '../src/domain/evolution';
import { keyFor, type SpeciesKey } from '../src/domain/species-key';
import { compareTier } from '../src/domain/tier';
import { type GenerationSource, tierAcrossGenerations } from '../src/domain/tier-cascade';
import type { TierEntry } from '../src/domain/tier-table';
import { bestFormOfLine, GMAX_BY_NUMBER, MEGA_BY_NUMBER } from './unlocked-forms.mjs';

const REGIONAL_FORMS = new Set(['alola', 'galar', 'hisui', 'paldea']);
const GENERATION = 9;

const dex = Dex.forGen(GENERATION);
const species: SpeciesSource = { get: (name) => dex.species.get(name) };

const generations: GenerationSource[] = Array.from({ length: GENERATION }, (_, index) => {
  const gen = GENERATION - index;
  const genDex = Dex.forGen(gen);
  return { gen, source: { get: (name) => genDex.species.get(name) } };
});

const tierOf = (name: string) => tierAcrossGenerations(generations, name)?.tier ?? null;

function regionOf(entry: Species): string {
  if (!entry.forme) return '';
  const region = entry.forme.split('-')[0]?.toLowerCase() ?? '';
  return REGIONAL_FORMS.has(region) ? region : '';
}

function keyOf(entry: Species): SpeciesKey | null {
  if (entry.num < 1) return null;
  if (entry.forme && !regionOf(entry)) return null;
  return keyFor(entry.num, regionOf(entry));
}

function entryFor(entry: Species): TierEntry {
  const line = reachableLine(species, entry);
  const dexNumbers = line.map((name) => dex.species.get(name).num);

  return {
    name: entry.name,
    tier: tierOf(entry.name),
    ...bestOfLine(line, tierOf),
    mega: bestFormOfLine(MEGA_BY_NUMBER, dexNumbers),
    gmax: bestFormOfLine(GMAX_BY_NUMBER, dexNumbers),
  };
}

const table: Record<SpeciesKey, TierEntry> = {};

for (const entry of dex.species.all()) {
  const key = keyOf(entry);
  if (!key) continue;

  const candidate = entryFor(entry);
  const existing = table[key];
  if (existing && compareTier(existing.bestTier, candidate.bestTier) <= 0) continue;

  table[key] = candidate;
}

const code = [
  `import type { TierTable } from '../src/domain/tier-table';`,
  '',
  `export const TIER_TABLE: TierTable = ${JSON.stringify(table)};`,
  '',
].join('\n');

writeFileSync(new URL('../data/tier-table.generated.ts', import.meta.url), code);

process.stdout.write(`${Object.keys(table).length} especies em data/tier-table.generated.ts\n`);
