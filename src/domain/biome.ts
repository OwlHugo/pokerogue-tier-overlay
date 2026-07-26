export type PoolTier = 'COMMON' | 'UNCOMMON' | 'RARE' | 'SUPER_RARE' | 'ULTRA_RARE' | 'BOSS';

export interface BiomeEntry {
  name: string;
  pools: Partial<Record<PoolTier, readonly number[]>>;
}

export type BiomeTable = Record<number, BiomeEntry>;

export const POOL_TIER_ORDER: readonly PoolTier[] = [
  'BOSS',
  'ULTRA_RARE',
  'SUPER_RARE',
  'RARE',
  'UNCOMMON',
  'COMMON',
];
