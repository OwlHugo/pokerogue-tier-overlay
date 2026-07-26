export type SpeciesKey = string;

export interface SpeciesRef {
  speciesId: number;
  formKey: string;
}

export function keyFor(speciesId: number, formKey: string): SpeciesKey {
  return formKey ? `${speciesId}:${formKey}` : `${speciesId}`;
}
