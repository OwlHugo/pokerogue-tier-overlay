// Gera data/tiers.json a partir do dex do Smogon (gen 9, a mais recente do @pkmn/dex).
// Roda offline; o runtime nunca toca a rede.
import { writeFileSync } from 'node:fs';
import { Dex } from '@pkmn/dex';
import { evoLine } from '../src/evo-line.mjs';
import { betterTier } from '../src/tier-rank.mjs';

const REGIONAL = ['alola', 'galar', 'hisui', 'paldea'];
const dex = Dex.forGen(9);

// O PokeRogue identifica formas por formKey ("alola", "galar", ...). O dex usa o sufixo
// do nome ("Raichu-Alola"). Traduz um no outro; formas nao-regionais nao ganham chave
// propria e caem na entrada base do numero da Pokedex.
function keyOf(species) {
  // num negativo = CAP, especies inventadas pelo Smogon que nao existem no PokeRogue.
  if (species.num < 1) return null;
  if (!species.forme) return String(species.num);
  const region = species.forme.split('-')[0].toLowerCase();
  return REGIONAL.includes(region) ? `${species.num}:${region}` : null;
}

const clean = (tier) => (RANKABLE.has(String(tier).replace(/[()]/g, '')) ? tier : null);
const RANKABLE = new Set([
  'AG', 'Uber', 'OU', 'UUBL', 'UU', 'RUBL', 'RU',
  'NUBL', 'NU', 'PUBL', 'PU', 'ZUBL', 'ZU', 'NFE', 'LC',
]);

const out = {};
for (const species of dex.species.all()) {
  const key = keyOf(species);
  if (!key) continue;

  const { line, bestTier, bestName } = evoLine(dex, species);
  const entry = { tier: clean(species.tier), bestTier, bestName, line };

  // Varias formas regionais compartilham a mesma chave (Tauros-Paldea-Combat/Blaze/Aqua).
  // Fica a de melhor tier — a informacao que importa para decidir captura.
  const prev = out[key];
  if (prev && betterTier(prev.bestTier, entry.bestTier) === prev.bestTier) continue;
  out[key] = entry;
}

const path = new URL('../data/tiers.json', import.meta.url);
writeFileSync(path, `${JSON.stringify(out, null, 0)}\n`);
console.log(`${Object.keys(out).length} entradas em data/tiers.json`);
