import { writeFileSync } from 'node:fs';
import { Dex } from '@pkmn/dex';
import type { MovesetTable, SmogonBuild, SmogonSet } from '../src/domain/moveset';
import { keyFor, type SpeciesKey } from '../src/domain/species-key';

const SOURCE = 'https://data.pkmn.cc/sets';
const GENERATIONS = [9, 8, 7, 6, 5, 4, 3, 2, 1];
const MOVES_PER_SPECIES = 6;
const MOVES_PER_SET = 4;
const SETS_PER_SPECIES = 2;
const REGIONAL_FORMS = new Set(['alola', 'galar', 'hisui', 'paldea']);
const MECANICA_AUSENTE = /\bZ[- ]|Z-Move|Z Crystal|Dynamax/i;

type RawMove = string | string[];
type RawSet = { moves?: RawMove[]; nature?: string | string[]; ability?: string | string[] };
type RawGeneration = Record<string, Record<string, Record<string, RawSet>>>;

async function fetchGeneration(gen: number): Promise<RawGeneration> {
  const response = await fetch(`${SOURCE}/gen${gen}.json`, { redirect: 'follow' });
  if (!response.ok) throw new Error(`gen${gen}: HTTP ${response.status}`);
  return response.json() as Promise<RawGeneration>;
}

const primeiro = (valor: string | string[] | undefined): string | null =>
  Array.isArray(valor) ? (valor[0] ?? null) : (valor ?? null);

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

function movesOfSet(set: RawSet): string[] {
  return (set.moves ?? []).flatMap((slot) => (Array.isArray(slot) ? (slot[0] ?? []) : slot));
}

function buildOf(sets: Record<string, RawSet>): SmogonBuild | null {
  const moves = topMoves(sets);
  if (!moves.length) return null;

  const nomeados: SmogonSet[] = [];

  for (const [chave, set] of Object.entries(sets)) {
    const nome = chave.split(':')[1] ?? chave;
    if (MECANICA_AUSENTE.test(nome)) continue;

    const proprios = movesOfSet(set);
    if (proprios.length < 3) continue;

    nomeados.push({
      name: nome,
      moves: proprios.slice(0, MOVES_PER_SET),
      nature: primeiro(set.nature),
      ability: primeiro(set.ability),
    });

    if (nomeados.length === SETS_PER_SPECIES) break;
  }

  return { moves, sets: nomeados };
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
