import { type BiomeTable, POOL_TIER_ORDER, type PoolTier } from '../domain/biome';
import { missingTypes } from '../domain/coverage';
import type { MovesetTable, SmogonBuild } from '../domain/moveset';
import { bestReachable, type ReachableSource } from '../domain/reachable';
import { keyFor } from '../domain/species-key';
import { type TeamSpecies, teamSpeciesOf } from '../domain/team-species';
import { compareTier, type Tier } from '../domain/tier';
import { resolveTiers, type TierTable } from '../domain/tier-table';
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
  hiddenAbility: string | null;
  catchRate: number | null;
  owned: boolean;
  rarity: PoolTier | null;
  types: readonly number[];
  evolutions: readonly { name: string; level: number; tier: Tier | null }[];
  build: SmogonBuild | null;
}

export interface BiomeGroup {
  tier: PoolTier;
  entries: PokemonRow[];
}

export interface DestinationGroup {
  biome: number;
  name: string;
  novos: number;
  total: number;
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
  const build =
    movesets[keyFor(ref.speciesId, ref.formKey)] ?? movesets[keyFor(ref.speciesId, '')] ?? null;

  return {
    key: `${speciesId}`,
    name,
    level,
    tier: resolved.tier,
    reachTier: reach.tier,
    reachName: reach.name,
    source: reach.source,
    moves: build?.moves ?? [],
    build,
    hiddenAbility: null,
    catchRate: null,
    owned: false,
    rarity: null,
    types: [],
    evolutions: [],
  };
}

function evolutionsOf(
  pokemon: PokeRoguePokemon,
  table: TierTable,
): readonly { name: string; level: number; tier: Tier | null }[] {
  const steps = pokemon.species.getEvolutionLevels?.() ?? [];

  return steps
    .map(([speciesId, level]) => {
      const entry = table[`${speciesId}`];
      return {
        name: entry?.name ?? `#${speciesId}`,
        level,
        tier: entry?.tier ?? null,
      };
    })
    .sort((a, b) => a.level - b.level);
}

function detailsOf(
  pokemon: PokeRoguePokemon,
  abilityNames: Record<number, string>,
): Pick<PokemonRow, 'hiddenAbility' | 'catchRate' | 'types'> {
  const species = pokemon.species;
  const hidden = species.abilityHidden;

  return {
    hiddenAbility: hidden ? (abilityNames[hidden] ?? null) : null,
    catchRate: species.catchRate ?? null,
    types: [species.type1, species.type2].filter((t): t is number => typeof t === 'number'),
  };
}

const rowForPokemon = (
  pokemon: PokeRoguePokemon,
  table: TierTable,
  movesets: MovesetTable,
  abilityNames: Record<number, string>,
): PokemonRow => ({
  ...rowFor(
    pokemon.species.name,
    pokemon.species.speciesId,
    pokemon.level ?? null,
    table,
    movesets,
  ),
  ...detailsOf(pokemon, abilityNames),
  evolutions: evolutionsOf(pokemon, table),
});

const byReach = (a: PokemonRow, b: PokemonRow) => compareTier(a.reachTier, b.reachTier);

export function fieldView(
  scene: BattleScene,
  table: TierTable,
  movesets: MovesetTable = {},
  abilityNames: Record<number, string> = {},
): PokemonRow[] {
  if (!scene.currentBattle) return [];
  return scene
    .getEnemyField()
    .map((pokemon) => rowForPokemon(pokemon, table, movesets, abilityNames));
}

export function partyView(
  scene: BattleScene,
  table: TierTable,
  movesets: MovesetTable = {},
  abilityNames: Record<number, string> = {},
): PokemonRow[] {
  return (scene.party ?? []).map((pokemon) =>
    rowForPokemon(pokemon, table, movesets, abilityNames),
  );
}

export function teamOf(scene: BattleScene): TeamSpecies {
  return teamSpeciesOf((scene.party ?? []).map((p) => ({ speciesId: p.species.speciesId })));
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
  caught: TeamSpecies = new Set(),
): DestinationGroup[] {
  const current = biomeId === null ? undefined : biomes[biomeId];
  if (!current) return [];

  return current.links.flatMap((destination) => {
    const entry = biomes[destination];
    if (!entry) return [];

    const vistos = new Set<number>();
    const todos: PokemonRow[] = [];

    for (const poolTier of POOL_TIER_ORDER) {
      for (const speciesId of entry.pools[poolTier] ?? []) {
        if (vistos.has(speciesId)) continue;
        vistos.add(speciesId);
        todos.push(speciesRow(speciesId, table, movesets, caught, poolTier));
      }
    }

    const novos = todos.filter((row) => !row.owned);

    return [
      {
        biome: destination,
        name: entry.name,
        novos: novos.length,
        total: todos.length,
        highlights: novos.slice(0, HIGHLIGHT_LIMIT),
      },
    ];
  });
}

function speciesRow(
  speciesId: number,
  table: TierTable,
  movesets: MovesetTable,
  caught: TeamSpecies,
  rarity: PoolTier,
): PokemonRow {
  const known = table[`${speciesRefOf(speciesId, '').speciesId}`];
  return {
    ...rowFor(known?.name ?? `#${speciesId}`, speciesId, null, table, movesets),
    owned: caught.has(speciesId),
    rarity,
  };
}

export function biomeView(
  biomeId: number,
  biomes: BiomeTable,
  table: TierTable,
  movesets: MovesetTable = {},
  caught: TeamSpecies = new Set(),
): BiomeGroup[] {
  const biome = biomes[biomeId];
  if (!biome) return [];

  const groups: BiomeGroup[] = [];

  for (const poolTier of POOL_TIER_ORDER) {
    const ids = biome.pools[poolTier];
    if (!ids?.length) continue;

    const entries = ids
      .map((speciesId) => speciesRow(speciesId, table, movesets, caught, poolTier))
      .sort((a, b) => Number(a.owned) - Number(b.owned) || byReach(a, b));

    groups.push({ tier: poolTier, entries });
  }

  return groups;
}
