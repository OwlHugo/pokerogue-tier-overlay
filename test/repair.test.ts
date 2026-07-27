import { describe, expect, test } from 'vitest';
import { type KeyValueStore, repairStarterPrefs } from '../src/game/repair';

const prefs = (usuario: string) => `starterPrefs_${usuario}`;
const save = (usuario: string) => `data_${usuario}`;

function fakeStore(
  entradas: Record<string, string>,
): KeyValueStore & { dados: Record<string, string> } {
  const dados = { ...entradas };
  return {
    dados,
    get length() {
      return Object.keys(dados).length;
    },
    key: (index) => Object.keys(dados)[index] ?? null,
    getItem: (chave) => dados[chave] ?? null,
    removeItem: (chave) => {
      delete dados[chave];
    },
  };
}

describe('repairStarterPrefs', () => {
  test('remove a chave que guarda a string literal undefined', () => {
    const store = fakeStore({ [prefs('ash')]: 'undefined' });

    expect(repairStarterPrefs(store)).toEqual([prefs('ash')]);
    expect(store.dados[prefs('ash')]).toBeUndefined();
  });

  test('nao toca em preferencia valida', () => {
    const store = fakeStore({ [prefs('ash')]: '{"1":{"nature":3}}' });

    expect(repairStarterPrefs(store)).toEqual([]);
    expect(store.dados[prefs('ash')]).toBe('{"1":{"nature":3}}');
  });

  test('nao toca em save encriptado, que nunca e JSON', () => {
    const store = fakeStore({ [save('ash')]: 'U2FsdGVkX1/OHymXuRrnb5hGqL59OpaO' });

    expect(repairStarterPrefs(store)).toEqual([]);
    expect(store.dados[save('ash')]).toBe('U2FsdGVkX1/OHymXuRrnb5hGqL59OpaO');
  });

  test('nao toca em outras chaves, mesmo com valor invalido', () => {
    const store = fakeStore({ prLang: 'en', [`runHistoryData_ash`]: '' });

    expect(repairStarterPrefs(store)).toEqual([]);
    expect(Object.keys(store.dados)).toHaveLength(2);
  });

  test('store vazia nao lanca', () => {
    expect(repairStarterPrefs(fakeStore({}))).toEqual([]);
  });

  test('remove de varias contas na mesma maquina', () => {
    const store = fakeStore({
      [prefs('ash')]: 'undefined',
      [prefs('gary')]: 'undefined',
      [prefs('misty')]: '{}',
    });

    expect([...repairStarterPrefs(store)].sort()).toEqual([
      'starterPrefs_ash',
      'starterPrefs_gary',
    ]);
    expect(store.dados[prefs('misty')]).toBe('{}');
  });
});
