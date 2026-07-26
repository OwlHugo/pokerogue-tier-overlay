export const TIER_ORDER = [
  'AG',
  'Uber',
  'OU',
  'UUBL',
  'UU',
  'RUBL',
  'RU',
  'NUBL',
  'NU',
  'PUBL',
  'PU',
  'ZUBL',
  'ZU',
  'NFE',
  'LC',
] as const;

export type Tier = (typeof TIER_ORDER)[number];

const RANK = new Map<string, number>(TIER_ORDER.map((tier, index) => [tier, index]));

const UNRANKED = Number.MAX_SAFE_INTEGER;

const stripBanlistMarker = (value: string): string => value.replace(/[()]/g, '');

export function normalizeTier(value: string | undefined | null): Tier | null {
  if (!value) return null;
  const stripped = stripBanlistMarker(value);
  return RANK.has(stripped) ? (stripped as Tier) : null;
}

const rankOf = (tier: Tier | null): number =>
  tier === null ? UNRANKED : (RANK.get(tier) ?? UNRANKED);

export function compareTier(a: Tier | null, b: Tier | null): number {
  return rankOf(a) - rankOf(b);
}

export function bestOf(tiers: ReadonlyArray<Tier | null>): Tier | null {
  return tiers.reduce<Tier | null>(
    (best, tier) => (compareTier(tier, best) < 0 ? tier : best),
    null,
  );
}
