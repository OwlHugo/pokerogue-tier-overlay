import { betterTier } from './tier-rank.mjs';

function root(dex, species) {
  let cur = species;
  while (cur.prevo) cur = dex.species.get(cur.prevo);
  return cur;
}

function descend(dex, species, acc) {
  acc.push(species.name);
  for (const name of species.evos ?? []) descend(dex, dex.species.get(name), acc);
  return acc;
}

// Linha evolutiva completa (todos os ramos) e o melhor tier alcancado por ela.
export function evoLine(dex, species) {
  const line = descend(dex, root(dex, species), []);

  let bestTier = null;
  let bestName = null;
  for (const name of line) {
    const tier = dex.species.get(name).tier;
    // betterTier devolve o proprio tier so quando ele e conhecido e supera o atual;
    // empate mantem o primeiro membro da linha.
    if (tier === bestTier || betterTier(tier, bestTier) !== tier) continue;
    bestTier = tier;
    bestName = name;
  }

  return { line, bestTier, bestName };
}
