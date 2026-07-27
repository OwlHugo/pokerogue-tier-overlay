import { describe, expect, test } from 'vitest';
import { ALL_TYPES, missingTypes, typeNameOf } from '../src/domain/coverage';

describe('missingTypes', () => {
  test('time vazio devolve lista vazia em vez de todos os tipos', () => {
    expect(missingTypes([])).toEqual([]);
  });

  test('lista os tipos que ninguem no time tem', () => {
    const faltando = missingTypes([{ types: [10] }]);
    expect(faltando).not.toContain(10);
    expect(faltando).toHaveLength(ALL_TYPES.length - 1);
  });

  test('tipo duplo cobre os dois', () => {
    const faltando = missingTypes([{ types: [10, 11] }]);
    expect(faltando).not.toContain(10);
    expect(faltando).not.toContain(11);
    expect(faltando).toHaveLength(ALL_TYPES.length - 2);
  });

  test('membros diferentes somam cobertura', () => {
    const faltando = missingTypes([{ types: [10] }, { types: [11] }]);
    expect(faltando).toHaveLength(ALL_TYPES.length - 2);
  });

  test('tipo repetido nao conta duas vezes', () => {
    expect(missingTypes([{ types: [10] }, { types: [10] }])).toHaveLength(ALL_TYPES.length - 1);
  });

  test('time que cobre tudo devolve lista vazia', () => {
    expect(missingTypes([{ types: [...ALL_TYPES] }])).toEqual([]);
  });

  test('preserva a ordem canonica dos tipos', () => {
    const faltando = missingTypes([{ types: [ALL_TYPES[0] as number] }]);
    expect(faltando).toEqual(ALL_TYPES.slice(1));
  });
});

describe('typeNameOf', () => {
  test('traduz os ids conhecidos', () => {
    expect(typeNameOf(9)).toBe('Fogo');
    expect(typeNameOf(10)).toBe('Água');
    expect(typeNameOf(17)).toBe('Fada');
  });

  test('id desconhecido devolve null em vez de inventar nome', () => {
    expect(typeNameOf(999)).toBeNull();
  });
});
