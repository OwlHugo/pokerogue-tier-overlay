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
  fusion?: { speciesId: number; name: string; formIndex?: number; forms?: SpeciesForm[] };
}

export function fakePokemon(options: PokemonOptions): PokeRoguePokemon {
  const pokemon = new FakeContainer() as FakeContainer & PokeRoguePokemon;
  pokemon.species = {
    speciesId: options.speciesId,
    name: options.name,
    forms: options.forms ?? [],
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
}): FakeScene & BattleScene {
  const scene = new FakeScene() as FakeScene & BattleScene;
  scene.currentBattle = options.enemies ? {} : null;
  scene.getEnemyField = () => options.enemies ?? [];
  scene.ui = { mode: 0, handlers: [] };
  return scene;
}
