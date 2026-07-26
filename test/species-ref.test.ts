import { describe, expect, test } from 'vitest';
import { speciesRefOf } from '../src/game/species-ref';

describe('speciesRefOf', () => {
  test('mantem as especies dentro da pokedex nacional', () => {
    expect(speciesRefOf(163, '')).toEqual({ speciesId: 163, formKey: '' });
    expect(speciesRefOf(1025, '')).toEqual({ speciesId: 1025, formKey: '' });
  });

  test('preserva a forma vinda do indice quando ela existe', () => {
    expect(speciesRefOf(26, 'alola')).toEqual({ speciesId: 26, formKey: 'alola' });
  });

  test('traduz os ids proprios que o PokeRogue usa para formas regionais', () => {
    expect(speciesRefOf(2019, '')).toEqual({ speciesId: 19, formKey: 'alola' });
    expect(speciesRefOf(4052, '')).toEqual({ speciesId: 52, formKey: 'galar' });
    expect(speciesRefOf(6058, '')).toEqual({ speciesId: 58, formKey: 'hisui' });
    expect(speciesRefOf(8194, '')).toEqual({ speciesId: 194, formKey: 'paldea' });
  });

  test('formas nao regionais caem na especie base', () => {
    expect(speciesRefOf(2658, '')).toEqual({ speciesId: 658, formKey: 'alola' });
    expect(speciesRefOf(8901, '')).toEqual({ speciesId: 901, formKey: 'paldea' });
  });

  test('prefixo desconhecido ainda resolve a especie base', () => {
    expect(speciesRefOf(3123, '')).toEqual({ speciesId: 123, formKey: '' });
  });
});
