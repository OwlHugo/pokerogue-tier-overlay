import { writeFileSync } from 'node:fs';
import { Dex } from '@pkmn/dex';
import type { MovesetTable, SmogonBuild, StatSpread } from '../src/domain/moveset';
import { keyFor, type SpeciesKey } from '../src/domain/species-key';

const SOURCE = 'https://data.pkmn.cc/sets';
const GENERATIONS = [9, 8, 7, 6, 5, 4, 3, 2, 1];
const MOVES_PER_SPECIES = 6;
const REGIONAL_FORMS = new Set(['alola', 'galar', 'hisui', 'paldea']);

type RawMove = string | string[];
type RawSet = {
  moves?: RawMove[];
  nature?: string | string[];
  item?: string | string[];
  evs?: StatSpread | StatSpread[];
  ivs?: StatSpread | StatSpread[];
};

const primeiroSpread = (valor: StatSpread | StatSpread[] | undefined): StatSpread | null =>
  Array.isArray(valor) ? (valor[0] ?? null) : (valor ?? null);

const primeiro = (valor: string | string[] | undefined): string | null =>
  Array.isArray(valor) ? (valor[0] ?? null) : (valor ?? null);
type RawGeneration = Record<string, Record<string, Record<string, RawSet>>>;

async function fetchGeneration(gen: number): Promise<RawGeneration> {
  const response = await fetch(`${SOURCE}/gen${gen}.json`, { redirect: 'follow' });
  if (!response.ok) throw new Error(`gen${gen}: HTTP ${response.status}`);
  return response.json() as Promise<RawGeneration>;
}

function countMoves(sets: Record<string, RawSet>): Map<string, number> {
  const counts = new Map<string, number>();

  for (const set of Object.values(sets)) {
    for (const slot of set.moves ?? []) {
      for (const move of Array.isArray(slot) ? slot : [slot]) {
        counts.set(move, (counts.get(move) ?? 0) + 1);
      }
    }
  }

  return counts;
}

function topMoves(sets: Record<string, RawSet>): string[] {
  return [...countMoves(sets)]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, MOVES_PER_SPECIES)
    .map(([move]) => move);
}

function maisComum<T>(valores: readonly T[], chave: (valor: T) => string): T | null {
  const contagem = new Map<string, { valor: T; vezes: number }>();

  for (const valor of valores) {
    const k = chave(valor);
    const atual = contagem.get(k);
    if (atual) atual.vezes += 1;
    else contagem.set(k, { valor, vezes: 1 });
  }

  const melhor = [...contagem.entries()].sort(
    (a, b) => b[1].vezes - a[1].vezes || a[0].localeCompare(b[0]),
  )[0];

  return melhor ? melhor[1].valor : null;
}

function buildOf(sets: Record<string, RawSet>): SmogonBuild | null {
  const moves = topMoves(sets);
  if (!moves.length) return null;

  const todos = Object.values(sets);

  const estrategias = [
    ...new Set(
      Object.keys(sets)
        .map((nome) => nome.split(':')[1] ?? '')
        .filter(Boolean),
    ),
  ].slice(0, 3);

  return {
    moves,
    strategies: estrategias,
    nature: maisComum(
      todos.flatMap((set) => {
        const n = primeiro(set.nature);
        return n ? [n] : [];
      }),
      (n) => n,
    ),
    item: maisComum(
      todos.flatMap((set) => {
        const i = primeiro(set.item);
        return i ? [i] : [];
      }),
      (i) => i,
    ),
    evs: maisComum(
      todos.flatMap((set) => {
        const e = primeiroSpread(set.evs);
        return e ? [e] : [];
      }),
      (e) => JSON.stringify(e),
    ),
    ivs: maisComum(
      todos.flatMap((set) => {
        const i = primeiroSpread(set.ivs);
        return i ? [i] : [];
      }),
      (i) => JSON.stringify(i),
    ),
  };
}

function keyOfSpeciesName(name: string): SpeciesKey | null {
  const species = Dex.species.get(name);
  if (!species?.exists || species.num < 1) return null;

  const region = species.forme?.split('-')[0]?.toLowerCase() ?? '';
  if (species.forme && !REGIONAL_FORMS.has(region)) return keyFor(species.num, '');
  return keyFor(species.num, REGIONAL_FORMS.has(region) ? region : '');
}

const table: MovesetTable = {};

for (const gen of GENERATIONS) {
  const data = await fetchGeneration(gen).catch(() => null);
  if (!data) continue;

  for (const [name, byTier] of Object.entries(data)) {
    const key = keyOfSpeciesName(name);
    if (!key || table[key]) continue;

    const sets: Record<string, RawSet> = {};
    for (const [tierName, tierSets] of Object.entries(byTier)) {
      for (const [setName, set] of Object.entries(tierSets)) {
        sets[`${tierName}:${setName}`] = set;
      }
    }

    const build = buildOf(sets);
    if (build) table[key] = build;
  }
}

const code = [
  `import type { MovesetTable } from '../src/domain/moveset';`,
  '',
  `export const MOVESET_TABLE: MovesetTable = ${JSON.stringify(table)};`,
  '',
].join('\n');

writeFileSync(new URL('../data/moveset-table.generated.ts', import.meta.url), code);

process.stdout.write(`${Object.keys(table).length} especies em data/moveset-table.generated.ts\n`);
