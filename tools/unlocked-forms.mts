import { Dex } from '@pkmn/dex';
import { compareTier, normalizeTier } from '../src/domain/tier';
import type { UnlockedForm } from '../src/domain/tier-table';

const MEGA_GENERATION = 7;
const GMAX_GENERATION = 8;

function bestByDexNumber(
  gen: number,
  matches: (forme: string) => boolean,
): Map<number, UnlockedForm> {
  const best = new Map<number, UnlockedForm>();

  for (const species of Dex.forGen(gen).species.all()) {
    if (!species.forme || !matches(species.forme)) continue;
    const tier = normalizeTier(species.tier);
    if (!tier) continue;

    const current = best.get(species.num);
    if (current && compareTier(current.tier, tier) <= 0) continue;
    best.set(species.num, { tier, name: species.name });
  }

  return best;
}

export const MEGA_BY_NUMBER = bestByDexNumber(MEGA_GENERATION, (forme) => forme.startsWith('Mega'));
export const GMAX_BY_NUMBER = bestByDexNumber(GMAX_GENERATION, (forme) => forme === 'Gmax');

export function bestFormOfLine(
  source: Map<number, UnlockedForm>,
  dexNumbers: readonly number[],
): UnlockedForm | null {
  let best: UnlockedForm | null = null;

  for (const num of dexNumbers) {
    const candidate = source.get(num);
    if (!candidate) continue;
    if (best && compareTier(best.tier, candidate.tier) <= 0) continue;
    best = candidate;
  }

  return best;
}
