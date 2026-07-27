import type { SpeciesKey } from './species-key';

export type StatSpread = Readonly<Record<string, number>>;

export interface SmogonBuild {
  moves: readonly string[];
  strategies: readonly string[];
  nature: string | null;
  item: string | null;
  evs: StatSpread | null;
  ivs: StatSpread | null;
}

export type MovesetTable = Record<SpeciesKey, SmogonBuild>;

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  atk: 'Atq',
  def: 'Def',
  spa: 'AtqEsp',
  spd: 'DefEsp',
  spe: 'Vel',
};

const STAT_ORDER = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

export function spreadText(spread: StatSpread | null): string | null {
  if (!spread) return null;

  const parts = STAT_ORDER.filter((stat) => spread[stat] !== undefined).map(
    (stat) => `${spread[stat]} ${STAT_LABELS[stat] ?? stat}`,
  );

  return parts.length ? parts.join(' / ') : null;
}
