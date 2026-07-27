import { keyFor } from '../domain/species-key';
import { type BattleScene, formKeyOf, type PokeRoguePokemon } from './pokerogue';
import { speciesRefOf } from './species-ref';
import type { Target } from './target';

const BADGE_OFFSET = { x: 0, y: -52 };
const BADGE_SCALE = 0.16;

function targetFor(pokemon: PokeRoguePokemon, index: number): Target {
  const primary = speciesRefOf(
    pokemon.species.speciesId,
    formKeyOf(pokemon.species, pokemon.formIndex),
  );
  const fusionSpecies = pokemon.fusionSpecies;
  const fusion = fusionSpecies
    ? speciesRefOf(fusionSpecies.speciesId, formKeyOf(fusionSpecies, pokemon.fusionFormIndex))
    : null;

  const name = fusionSpecies
    ? `${pokemon.species.name}/${fusionSpecies.name}`
    : pokemon.species.name;

  return {
    key: `battle:${index}:${keyFor(primary.speciesId, primary.formKey)}`,
    name,
    primary,
    fusion,
    parent: pokemon,
    offset: BADGE_OFFSET,
    scale: BADGE_SCALE,
  };
}

export function readBattleTargets(scene: BattleScene): Target[] {
  if (!scene.currentBattle) return [];
  return scene.getEnemyField().map(targetFor);
}
