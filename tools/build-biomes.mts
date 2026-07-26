import { writeFileSync } from 'node:fs';
import type { BiomeTable } from '../src/domain/biome';

const REPO = 'https://raw.githubusercontent.com/pagefaultgames/pokerogue/beta';
const POOL_TIERS = ['COMMON', 'UNCOMMON', 'RARE', 'SUPER_RARE', 'ULTRA_RARE', 'BOSS'] as const;

async function fetchText(path: string): Promise<string> {
  const response = await fetch(`${REPO}/${path}`);
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.text();
}

function parseNumericEnum(source: string): Map<string, number> {
  const entries = new Map<string, number>();
  for (const [, name, value] of source.matchAll(/^\s{2}([A-Z][A-Z_0-9]*): (\d+),/gm)) {
    entries.set(name as string, Number(value));
  }
  return entries;
}

function parseTsEnum(source: string): Map<string, number> {
  const entries = new Map<string, number>();
  let next = 0;

  for (const [, name, value] of source.matchAll(/^\s{2}([A-Z][A-Z_0-9]*)(?: = (\d+))?,\s*$/gm)) {
    if (value !== undefined) next = Number(value);
    entries.set(name as string, next);
    next += 1;
  }

  return entries;
}

function sliceBlock(source: string, marker: string): string {
  const start = source.indexOf(marker);
  if (start < 0) return '';
  const end = source.indexOf('\n};', start);
  return source.slice(start, end < 0 ? undefined : end);
}

function speciesByTier(pool: string, speciesIds: Map<string, number>): Record<string, number[]> {
  const result: Record<string, number[]> = {};

  for (const tier of POOL_TIERS) {
    const marker = `[BiomePoolTier.${tier}]`;
    const start = pool.indexOf(marker);
    if (start < 0) continue;

    const nextStarts = POOL_TIERS.map((other) =>
      pool.indexOf(`[BiomePoolTier.${other}]`, start + 1),
    ).filter((index) => index > start);
    const end = nextStarts.length ? Math.min(...nextStarts) : pool.length;

    const names = new Set<number>();
    for (const [, name] of pool.slice(start, end).matchAll(/SpeciesId\.([A-Z_0-9]+)/g)) {
      const id = speciesIds.get(name as string);
      if (id !== undefined) names.add(id);
    }
    if (names.size) result[tier] = [...names].sort((a, b) => a - b);
  }

  return result;
}

const [biomeIdSource, speciesIdSource] = await Promise.all([
  fetchText('src/enums/biome-id.ts'),
  fetchText('src/enums/species-id.ts'),
]);

const biomeIds = parseNumericEnum(biomeIdSource);
const speciesIds = parseTsEnum(speciesIdSource);

if (biomeIds.size === 0 || speciesIds.size === 0) {
  throw new Error('enums do PokeRogue mudaram de formato');
}

const fileNameOf = (biome: string) => `${biome.toLowerCase().replace(/_/g, '-')}.ts`;

const table: BiomeTable = {};
const ausentes: string[] = [];

await Promise.all(
  [...biomeIds].map(async ([name, id]) => {
    const source = await fetchText(`src/data/balance/biomes/${fileNameOf(name)}`).catch(() => '');
    if (!source) {
      ausentes.push(name);
      return;
    }

    const pools = speciesByTier(sliceBlock(source, 'const pokemonPool'), speciesIds);
    if (Object.keys(pools).length === 0) return;

    table[id] = { name, pools };
  }),
);

const code = [
  `import type { BiomeTable } from '../src/domain/biome';`,
  '',
  `export const BIOME_TABLE: BiomeTable = ${JSON.stringify(table)};`,
  '',
].join('\n');

writeFileSync(new URL('../data/biome-table.generated.ts', import.meta.url), code);

process.stdout.write(`${Object.keys(table).length} biomas em data/biome-table.generated.ts\n`);
if (ausentes.length) process.stdout.write(`sem arquivo proprio: ${ausentes.join(', ')}\n`);
