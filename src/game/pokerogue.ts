import type { DisplayContainer, Scene } from './phaser';

export interface SpeciesForm {
  formKey: string;
}

export interface PokeRogueSpecies {
  speciesId: number;
  name: string;
  type1?: number;
  type2?: number | null;
  catchRate?: number;
  abilityHidden?: number;
  forms?: readonly SpeciesForm[];
  getEvolutionLevels?(): readonly (readonly [number, number])[];
}

export interface PokeRoguePokemon extends DisplayContainer {
  species: PokeRogueSpecies;
  formIndex: number;
  fusionSpecies: PokeRogueSpecies | null;
  fusionFormIndex: number;
  level?: number;
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

export interface Arena {
  biomeId: number;
}

export interface DexEntry {
  caughtAttr?: bigint | number;
}

export interface GameData {
  dexData?: Record<number, DexEntry>;
}

export interface BattleScene extends Scene {
  gameData?: GameData;
  currentBattle: object | null;
  getEnemyField(): readonly PokeRoguePokemon[];
  party?: readonly PokeRoguePokemon[];
  arena?: Arena;
  ui: Ui;
}

export function formKeyOf(species: PokeRogueSpecies, formIndex: number): string {
  return species.forms?.[formIndex]?.formKey ?? '';
}
