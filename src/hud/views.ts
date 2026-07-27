import { type BiomeTable, POOL_TIER_ORDER, type PoolTier } from '../domain/biome';
import { missingTypes } from '../domain/coverage';
import { bestReachable, type ReachableSource } from '../domain/reachable';
import { compareTier, type Tier } from '../domain/tier';
import { keyFor } from '../domain/species-key';
import { resolveTiers, type TierTable } from '../domain/tier-table';
import type { MovesetTable } from '../domain/moveset';
import type { BattleScene, PokeRoguePokemon } from '../game/pokerogue';
import { speciesRefOf } from '../game/species-ref';

export interface PokemonRow {
  key: string;
  name: string;
  level: number | null;
  tier: Tier | null;
  reachTier: Tier | null;
  reachName: string | null;
  source: ReachableSource;
  moves: readonly string[];
}

export interface BiomeGroup {
  tier: PoolTier;
  entries: PokemonRow[];
}

export interface DestinationGroup {
  biome: number;
  name: string;
  highlights: PokemonRow[];
}

const HIGHLIGHT_LIMIT = 6;

function rowFor(
  name: string,
  speciesId: number,
  level: number | null,
  table: TierTable,
  movesets: MovesetTable,
): PokemonRow {
  const ref = speciesRefOf(speciesId, '');
  const resolved = resolveTiers(table, ref, null);
  const reach = bestReachable(resolved);
  const moves = movesets[keyFor(ref.speciesId, ref.formKey)] ?? movesets[keyFor(ref.speciesId, '')];

  return {
    key: `${speciesId}`,
    name,
    level,
    tier: resolved.tier,
    reachTier: reach.tier,
    reachName: reach.name,
    source: reach.source,
    moves: moves ?? [],
  };
}

const rowForPokemon = (
  pokemon: PokeRoguePokemon,
  table: TierTable,
  movesets: MovesetTable,
): PokemonRow =>
  rowFor(pokemon.species.name, pokemon.species.speciesId, pokemon.level ?? null, table, movesets);

const byReach = (a: PokemonRow, b: PokemonRow) => compareTier(a.reachTier, b.reachTier);

export function fieldView(
  scene: BattleScene,
  table: TierTable,
  movesets: MovesetTable = {},
): PokemonRow[] {
  if (!scene.currentBattle) return [];
  return scene.getEnemyField().map((pokemon) => rowForPokemon(pokemon, table, movesets));
}

export function partyView(
  scene: BattleScene,
  table: TierTable,
  movesets: MovesetTable = {},
): PokemonRow[] {
  return (scene.party ?? []).map((pokemon) => rowForPokemon(pokemon, table, movesets));
}

export function coverageView(scene: BattleScene): readonly number[] {
  const team = (scene.party ?? []).map((pokemon) => ({
    types: [pokemon.species.type1, pokemon.species.type2].filter(
      (type): type is number => typeof type === 'number',
    ),
  }));

  return missingTypes(team);
}

export function destinationsView(
  biomeId: number | null,
  biomes: BiomeTable,
  table: TierTable,
  movesets: MovesetTable = {},
): DestinationGroup[] {
  const current = biomeId === null ? undefined : biomes[biomeId];
  if (!current) return [];

  return current.links.flatMap((destination) => {
    const entry = biomes[destination];
    if (!entry) return [];

    const highlights = Object.values(entry.pools)
      .flat()
      .map((speciesId) => {
        const known = table[`${speciesId}`];
        return rowFor(known?.name ?? `#${speciesId}`, speciesId, null, table, movesets);
      })
      .sort(byReach)
      .slice(0, HIGHLIGHT_LIMIT);

    return [{ biome: destination, name: entry.name, highlights }];
  });
}

export function biomeView(
  biomeId: number,
  biomes: BiomeTable,
  table: TierTable,
  movesets: MovesetTable = {},
): BiomeGroup[] {
  const biome = biomes[biomeId];
  if (!biome) return [];

  const groups: BiomeGroup[] = [];

  for (const poolTier of POOL_TIER_ORDER) {
    const ids = biome.pools[poolTier];
    if (!ids?.length) continue;

    const entries = ids
      .map((speciesId) => {
        const key = speciesRefOf(speciesId, '');
        const known = table[`${key.speciesId}`];
        return rowFor(known?.name ?? `#${speciesId}`, speciesId, null, table, movesets);
      })
      .sort(byReach);

    groups.push({ tier: poolTier, entries });
  }

  return groups;
}
