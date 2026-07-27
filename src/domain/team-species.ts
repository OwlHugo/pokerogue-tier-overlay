export interface TeamEntry {
  speciesId: number;
}

export type TeamSpecies = ReadonlySet<number>;

export function teamSpeciesOf(members: readonly TeamEntry[]): TeamSpecies {
  return new Set(members.map((member) => member.speciesId));
}
