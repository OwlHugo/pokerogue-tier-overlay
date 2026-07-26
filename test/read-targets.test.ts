import { describe, expect, test } from 'vitest';
import { readBattleTargets } from '../src/game/battle';
import { activeHandlerName } from '../src/game/context';
import { readStarterTargets } from '../src/game/starter';
import { FakeContainer } from './support/fake-phaser';
import { fakeBattleScene, fakePokemon, fakeStarterContainer } from './support/fake-pokerogue';

describe('readBattleTargets', () => {
  test('devolve vazio na tela de titulo, quando nao ha batalha', () => {
    expect(readBattleTargets(fakeBattleScene({ enemies: null }))).toEqual([]);
  });

  test('le a especie e a forma do inimigo em campo', () => {
    const targets = readBattleTargets(
      fakeBattleScene({ enemies: [fakePokemon({ speciesId: 163, name: 'Hoothoot' })] }),
    );

    expect(targets).toHaveLength(1);
    expect(targets[0]?.primary).toEqual({ speciesId: 163, formKey: '' });
    expect(targets[0]?.name).toBe('Hoothoot');
    expect(targets[0]?.fusion).toBeNull();
  });

  test('cada inimigo de uma batalha dupla vira um alvo com chave propria', () => {
    const targets = readBattleTargets(
      fakeBattleScene({
        enemies: [
          fakePokemon({ speciesId: 163, name: 'Hoothoot' }),
          fakePokemon({ speciesId: 129, name: 'Magikarp' }),
        ],
      }),
    );

    expect(targets).toHaveLength(2);
    expect(new Set(targets.map((target) => target.key)).size).toBe(2);
  });

  test('le a forma regional a partir do indice de forma', () => {
    const targets = readBattleTargets(
      fakeBattleScene({
        enemies: [
          fakePokemon({
            speciesId: 26,
            name: 'Raichu',
            formIndex: 1,
            forms: [{ formKey: '' }, { formKey: 'alola' }],
          }),
        ],
      }),
    );

    expect(targets[0]?.primary).toEqual({ speciesId: 26, formKey: 'alola' });
  });

  test('le a especie fundida quando ela existe', () => {
    const targets = readBattleTargets(
      fakeBattleScene({
        enemies: [
          fakePokemon({
            speciesId: 10,
            name: 'Caterpie',
            fusion: { speciesId: 129, name: 'Magikarp' },
          }),
        ],
      }),
    );

    expect(targets[0]?.fusion).toEqual({ speciesId: 129, formKey: '' });
    expect(targets[0]?.name).toBe('Caterpie/Magikarp');
  });

  test('o alvo aponta para o proprio pokemon como container pai', () => {
    const enemy = fakePokemon({ speciesId: 163, name: 'Hoothoot' });
    const targets = readBattleTargets(fakeBattleScene({ enemies: [enemy] }));

    expect(targets[0]?.parent).toBe(enemy);
  });
});

describe('readStarterTargets', () => {
  test('ignora os icones que o filtro escondeu', () => {
    const visible = fakeStarterContainer({ speciesId: 1, name: 'Bulbasaur', visible: true });
    const hidden = fakeStarterContainer({ speciesId: 4, name: 'Charmander', visible: false });

    const targets = readStarterTargets({ starterContainers: [visible, hidden] });

    expect(targets).toHaveLength(1);
    expect(targets[0]?.primary.speciesId).toBe(1);
  });

  test('cada icone visivel aponta para o proprio container', () => {
    const container = fakeStarterContainer({ speciesId: 1, name: 'Bulbasaur', visible: true });

    const targets = readStarterTargets({ starterContainers: [container] });

    expect(targets[0]?.parent).toBe(container);
  });

  test('devolve vazio quando a grade ainda nao foi montada', () => {
    expect(readStarterTargets({ starterContainers: [] })).toEqual([]);
  });
});

describe('activeHandlerName', () => {
  test('devolve o nome da classe do handler apontado pelo modo', () => {
    const ui = {
      mode: 1,
      handlers: [new FakeContainer(), { constructor: { name: 'TitleUiHandler' } }],
    };

    expect(activeHandlerName(ui)).toBe('TitleUiHandler');
  });

  test('devolve null quando o modo nao aponta para handler algum', () => {
    expect(activeHandlerName({ mode: 99, handlers: [] })).toBeNull();
  });
});
