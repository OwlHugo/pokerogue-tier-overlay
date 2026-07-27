import type { SpeciesKey } from './species-key';

export interface SmogonSet {
  name: string;
  moves: readonly string[];
  nature: string | null;
}

export interface SmogonBuild {
  moves: readonly string[];
  sets: readonly SmogonSet[];
}

export type MovesetTable = Record<SpeciesKey, SmogonBuild>;
