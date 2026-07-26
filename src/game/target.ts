import type { SpeciesRef } from '../domain/species-key';
import type { DisplayContainer } from './phaser';

export interface Target {
  key: string;
  name: string;
  primary: SpeciesRef;
  fusion: SpeciesRef | null;
  parent: DisplayContainer;
  offset: { x: number; y: number };
  scale: number;
}
