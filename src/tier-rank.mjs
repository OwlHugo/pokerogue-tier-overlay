// Ordem canonica dos tiers do Smogon, do melhor para o pior.
// Tiers fora desta lista (Illegal, Unreleased, undefined) sao tratados como ausentes.
const ORDER = [
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
];

export const RANK = Object.fromEntries(ORDER.map((tier, i) => [tier, i]));

// O dex marca Pokemon banidos de um tier com parenteses: "(OU)" = jogado em OU mas
// banido do tier abaixo. Para ranking, vale o tier de dentro dos parenteses.
const rankOf = (tier) => RANK[String(tier ?? '').replace(/[()]/g, '')];

export function betterTier(a, b) {
  const ra = rankOf(a);
  const rb = rankOf(b);
  if (ra === undefined) return rb === undefined ? null : b;
  if (rb === undefined) return a;
  return ra <= rb ? a : b;
}
