import { readdirSync, writeFileSync } from 'node:fs';
import type { BiomeEntry, BiomeTable, PoolTier } from '../src/domain/biome';
import { fetchUpstream, readPins } from './upstream.mts';

const POOL_TIERS: readonly PoolTier[] = [
  'COMMON',
  'UNCOMMON',
  'RARE',
  'SUPER_RARE',
  'ULTRA_RARE',
  'BOSS',
  'BOSS',
  'BOSS',
  'BOSS',
];

interface UpstreamBiome {
  biomeId: number;
  pokemonPool: Record<string, Record<string, readonly number[]>>;
  biomeLinks: readonly (number | readonly [number, number])[];
}

const pins = readPins();

const game = fetchUpstream('pokerogue', pins.pokerogue, [
  'src/data/balance/biomes',
  'src/enums',
  'src/@types',
]);

const { BiomeId } = (await import(`${game}/src/enums/biome-id.ts`)) as {
  BiomeId: Record<string, number>;
};

const nameById = new Map(
  Object.entries(BiomeId)
    .filter(([, id]) => typeof id === 'number')
    .map(([name, id]) => [id, name]),
);

const files = readdirSync(`${game}/src/data/balance/biomes`)
  .filter((file) => file.endsWith('.ts'))
  .sort();

const table: Record<number, BiomeEntry> = {};

for (const file of files) {
  const loaded = (await import(`${game}/src/data/balance/biomes/${file}`)) as Record<
    string,
    unknown
  >;

  const biome = Object.values(loaded).find(
    (value): value is UpstreamBiome =>
      typeof value === 'object' && value !== null && 'biomeId' in value && 'pokemonPool' in value,
  );

  if (!biome) throw new Error(`bioma sem export reconhecivel: ${file}`);

  const collected = new Map<PoolTier, Set<number>>();

  POOL_TIERS.forEach((label, tier) => {
    const ids = Object.values(biome.pokemonPool[tier] ?? {}).flat();
    if (ids.length === 0) return;
    const bucket = collected.get(label) ?? new Set<number>();
    for (const id of ids) bucket.add(id);
    collected.set(label, bucket);
  });

  const pools: Record<string, readonly number[]> = {};
  for (const label of POOL_TIERS) {
    const bucket = collected.get(label);
    if (bucket && !(label in pools)) pools[label] = [...bucket].sort((a, b) => a - b);
  }

  const links = [
    ...new Set(biome.biomeLinks.map((link) => (typeof link === 'number' ? link : link[0]))),
  ].sort((a, b) => a - b);

  table[biome.biomeId] = {
    name: nameById.get(biome.biomeId) ?? String(biome.biomeId),
    pools,
    links,
  };
}

const sorted = Object.fromEntries(
  Object.entries(table).sort(([a], [b]) => Number(a) - Number(b)),
) as BiomeTable;

const code = [
  `import type { BiomeTable } from '../src/domain/biome';`,
  '',
  `export const BIOME_TABLE: BiomeTable = ${JSON.stringify(sorted)};`,
  '',
].join('\n');

writeFileSync(new URL('../data/biome-table.generated.ts', import.meta.url), code);

process.stdout.write(`${Object.keys(sorted).length} biomas em data/biome-table.generated.ts\n`);
