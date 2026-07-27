const CORROMPIDO = 'undefined';

export interface KeyValueStore {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  removeItem(key: string): void;
}

export function repairStarterPrefs(store: KeyValueStore): readonly string[] {
  const removidas: string[] = [];

  for (let index = store.length - 1; index >= 0; index -= 1) {
    const chave = store.key(index);
    if (chave === null || !chave.startsWith('starterPrefs_')) continue;
    if (store.getItem(chave) !== CORROMPIDO) continue;

    store.removeItem(chave);
    removidas.push(chave);
  }

  return removidas;
}
