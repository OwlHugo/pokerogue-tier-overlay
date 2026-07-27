import { describe, expect, test } from 'vitest';
import { BIOME_TABLE } from '../data/biome-table.generated';
import { ABILITY_NAMES, BIOME_NAMES } from '../data/names.generated';

describe('nomes de bioma', () => {
  test('todo bioma da tabela tem nome legivel', () => {
    for (const key of Object.keys(BIOME_TABLE)) {
      expect(BIOME_NAMES.pt[Number(key)], key).toBeTypeOf('string');
    }
  });

  test('traz os nomes traduzidos, nao os identificadores do enum', () => {
    expect(BIOME_NAMES.pt[0]).toBe('Cidade');
    expect(BIOME_NAMES.pt[1]).toBe('Planície');
  });

  test('as chaves sao numericas', () => {
    for (const key of Object.keys(BIOME_NAMES.pt)) expect(key).toMatch(/^\d+$/);
  });
});

describe('nomes de ability', () => {
  test('cobre pelo menos 250 abilities', () => {
    expect(Object.keys(ABILITY_NAMES.pt).length).toBeGreaterThanOrEqual(250);
  });

  test('resolve a hidden ability do Ralts, lida ao vivo do jogo', () => {
    expect(ABILITY_NAMES.pt[140]).toBe('Telepathy');
  });

  test('as chaves sao numericas e positivas', () => {
    for (const key of Object.keys(ABILITY_NAMES.pt)) {
      expect(key).toMatch(/^\d+$/);
      expect(Number(key)).toBeGreaterThan(0);
    }
  });
});

describe('ambas as tabelas', () => {
  test('nenhum nome vazio', () => {
    for (const table of [ABILITY_NAMES.pt, BIOME_NAMES.pt, ABILITY_NAMES.en, BIOME_NAMES.en]) {
      for (const [key, name] of Object.entries(table)) expect(name.length, key).toBeGreaterThan(0);
    }
  });
});
