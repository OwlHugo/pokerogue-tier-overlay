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
  abilities: readonly { id: number; hidden: boolean }[];
  recommendedAbility: string | null;
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
    moves: build?.sets[0]?.moves ?? build?.moves ?? [],
    build,
    recommendedAbility: build?.sets[0]?.ability ?? null,
    abilities: [],
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

function abilitiesOf(species: PokeRoguePokemon['species']): { id: number; hidden: boolean }[] {
  const lista: { id: number; hidden: boolean }[] = [];
  const vistos = new Set<number>();

  for (const id of [species.ability1, species.ability2]) {
    if (typeof id === 'number' && id > 0 && !vistos.has(id)) {
      vistos.add(id);
      lista.push({ id, hidden: false });
    }
  }

  const hidden = species.abilityHidden;
  if (typeof hidden === 'number' && hidden > 0 && !vistos.has(hidden)) {
    lista.push({ id: hidden, hidden: true });
  }

  return lista;
}

function detailsOf(
  pokemon: PokeRoguePokemon,
): Pick<PokemonRow, 'abilities' | 'catchRate' | 'types'> {
  const species = pokemon.species;

  return {
    abilities: abilitiesOf(species),
    catchRate: species.catchRate ?? null,
    types: [species.type1, species.type2].filter((t): t is number => typeof t === 'number'),
  };
}

const rowForPokemon = (
  pokemon: PokeRoguePokemon,
  table: TierTable,
  movesets: MovesetTable,
): PokemonRow => ({
  ...rowFor(
    pokemon.species.name,
    pokemon.species.speciesId,
    pokemon.level ?? null,
    table,
    movesets,
  ),
  ...detailsOf(pokemon),
  evolutions: evolutionsOf(pokemon, table),
});

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

export function teamOf(scene: BattleScene): TeamSpecies {
  return teamSpeciesOf((scene.party ?? []).map((p) => ({ speciesId: p.species.speciesId })));
}

export function starterFocusView(
  handler: { lastSpecies?: PokeRoguePokemon['species'] } | null,
  table: TierTable,
  movesets: MovesetTable = {},
): PokemonRow[] {
  const species = handler?.lastSpecies;
  if (!species) return [];

  const base = rowFor(species.name, species.speciesId, null, table, movesets);

  return [
    {
      ...base,
      abilities: abilitiesOf(species),
      catchRate: species.catchRate ?? null,
      types: [species.type1, species.type2].filter((t): t is number => typeof t === 'number'),
    },
  ];
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

    const novos = todos.filter((row) => !row.owned).sort(byReach);

    return [
      {
        biome: destination,
        name: entry.name,
        novos: novos.length,
        total: todos.length,
        highlights: novos,
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

  const vistos = new Set<number>();
  const entries: PokemonRow[] = [];

  for (const poolTier of POOL_TIER_ORDER) {
    for (const speciesId of biome.pools[poolTier] ?? []) {
      if (vistos.has(speciesId)) continue;
      vistos.add(speciesId);
      entries.push(speciesRow(speciesId, table, movesets, caught, poolTier));
    }
  }

  if (!entries.length) return [];

  entries.sort((a, b) => Number(a.owned) - Number(b.owned) || byReach(a, b));

  return [{ tier: 'BOSS', entries }];
}
