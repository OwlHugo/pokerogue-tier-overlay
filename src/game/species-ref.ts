import type { SpeciesRef } from '../domain/species-key';

const NATIONAL_DEX_MAX = 1025;
const FORM_ID_BASE = 1000;

const REGION_BY_PREFIX: Record<number, string> = {
  2: 'alola',
  4: 'galar',
  6: 'hisui',
  8: 'paldea',
};

export function speciesRefOf(speciesId: number, formKey: string): SpeciesRef {
  if (speciesId <= NATIONAL_DEX_MAX) return { speciesId, formKey };

  const prefix = Math.floor(speciesId / FORM_ID_BASE);
  return {
    speciesId: speciesId % FORM_ID_BASE,
    formKey: REGION_BY_PREFIX[prefix] ?? '',
  };
}
