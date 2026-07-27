import type {
  BattleScene,
  PokeRoguePokemon,
  SpeciesForm,
  StarterContainer,
} from '../../src/game/pokerogue';
import { FakeContainer, FakeScene } from './fake-phaser';

interface PokemonOptions {
  speciesId: number;
  name: string;
  formIndex?: number;
  forms?: SpeciesForm[];
  catchRate?: number;
  ability1?: number;
  ability2?: number;
  abilityHidden?: number;
  types?: number[];
  fusion?: { speciesId: number; name: string; formIndex?: number; forms?: SpeciesForm[] };
}

export function fakePokemon(options: PokemonOptions): PokeRoguePokemon {
  const pokemon = new FakeContainer() as FakeContainer & PokeRoguePokemon;
  pokemon.species = {
    speciesId: options.speciesId,
    name: options.name,
    forms: options.forms ?? [],
    ...(options.catchRate === undefined ? {} : { catchRate: options.catchRate }),
    ...(options.ability1 === undefined ? {} : { ability1: options.ability1 }),
    ...(options.ability2 === undefined ? {} : { ability2: options.ability2 }),
    ...(options.abilityHidden === undefined ? {} : { abilityHidden: options.abilityHidden }),
    ...(options.types === undefined
      ? {}
      : { type1: options.types[0], type2: options.types[1] ?? null }),
  };
  pokemon.formIndex = options.formIndex ?? 0;
  pokemon.fusionSpecies = options.fusion
    ? {
        speciesId: options.fusion.speciesId,
        name: options.fusion.name,
        forms: options.fusion.forms ?? [],
      }
    : null;
  pokemon.fusionFormIndex = options.fusion?.formIndex ?? 0;
  return pokemon;
}

export function fakeStarterContainer(options: {
  speciesId: number;
  name: string;
  visible: boolean;
}): StarterContainer {
  const container = new FakeContainer() as FakeContainer & StarterContainer;
  container.species = { speciesId: options.speciesId, name: options.name, forms: [] };
  container.visible = options.visible;
  return container;
}

export function fakeBattleScene(options: {
  enemies: PokeRoguePokemon[] | null;
  party?: PokeRoguePokemon[];
}): FakeScene & BattleScene {
  const scene = new FakeScene() as FakeScene & BattleScene;
  scene.currentBattle = options.enemies ? {} : null;
  scene.getEnemyField = () => options.enemies ?? [];
  scene.party = options.party ?? [];
  scene.ui = { mode: 0, handlers: [] };
  return scene;
}
