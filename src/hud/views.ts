import { type BiomeTable, POOL_TIER_ORDER, type PoolTier } from '../domain/biome';
import { bestReachable, type ReachableSource } from '../domain/reachable';
import { compareTier, type Tier } from '../domain/tier';
import { resolveTiers, type TierTable } from '../domain/tier-table';
import type { BattleScene, PokeRoguePokemon } from '../game/pokerogue';
import { speciesRefOf } from '../game/species-ref';

export interface PokemonRow {
  name: string;
  level: number | null;
  tier: Tier | null;
  reachTier: Tier | null;
  reachName: string | null;
  source: ReachableSource;
}

export interface BiomeGroup {
  tier: PoolTier;
  entries: PokemonRow[];
}

function rowFor(
  name: string,
  speciesId: number,
  level: number | null,
  table: TierTable,
): PokemonRow {
  const resolved = resolveTiers(table, speciesRefOf(speciesId, ''), null);
  const reach = bestReachable(resolved);

  return {
    name,
    level,
    tier: resolved.tier,
    reachTier: reach.tier,
    reachName: reach.name,
    source: reach.source,
  };
}

const rowForPokemon = (pokemon: PokeRoguePokemon, table: TierTable): PokemonRow =>
  rowFor(pokemon.species.name, pokemon.species.speciesId, pokemon.level ?? null, table);

const byReach = (a: PokemonRow, b: PokemonRow) => compareTier(a.reachTier, b.reachTier);

export function fieldView(scene: BattleScene, table: TierTable): PokemonRow[] {
  if (!scene.currentBattle) return [];
  return scene.getEnemyField().map((pokemon) => rowForPokemon(pokemon, table));
}

export function partyView(scene: BattleScene, table: TierTable): PokemonRow[] {
  return (scene.party ?? []).map((pokemon) => rowForPokemon(pokemon, table));
}

export function biomeView(biomeId: number, biomes: BiomeTable, table: TierTable): BiomeGroup[] {
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
        return rowFor(known?.name ?? `#${speciesId}`, speciesId, null, table);
      })
      .sort(byReach);

    groups.push({ tier: poolTier, entries });
  }

  return groups;
}
