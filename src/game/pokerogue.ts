import type { DisplayContainer, Scene } from './phaser';

export interface SpeciesForm {
  formKey: string;
}

export interface PokeRogueSpecies {
  speciesId: number;
  name: string;
  forms?: readonly SpeciesForm[];
}

export interface PokeRoguePokemon extends DisplayContainer {
  species: PokeRogueSpecies;
  formIndex: number;
  fusionSpecies: PokeRogueSpecies | null;
  fusionFormIndex: number;
}

export interface StarterContainer extends DisplayContainer {
  species: PokeRogueSpecies;
}

export interface StarterSelectHandler {
  starterContainers: readonly StarterContainer[];
}

export interface Ui {
  mode: number;
  handlers: readonly object[];
}

export interface BattleScene extends Scene {
  currentBattle: object | null;
  getEnemyField(): readonly PokeRoguePokemon[];
  ui: Ui;
}

export function formKeyOf(species: PokeRogueSpecies, formIndex: number): string {
  return species.forms?.[formIndex]?.formKey ?? '';
}
