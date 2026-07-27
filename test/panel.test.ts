import { beforeEach, describe, expect, test } from 'vitest';
import { Panel } from '../src/hud/panel';
import type { PokemonRow } from '../src/hud/views';

const row = (over: Partial<PokemonRow> = {}): PokemonRow => ({
  key: '129',
  moves: [],
  name: 'Magikarp',
  level: 5,
  tier: 'LC',
  reachTier: 'RU',
  reachName: 'Gyarados',
  source: 'line',
  abilities: [],
  recommendedAbility: null,
  catchRate: null,
  owned: false,
  rarity: null,
  types: [],
  evolutions: [],
  build: null,
  ...over,
});

const toggle = () => document.querySelector<HTMLElement>('.ptr-toggle');
const panelBox = () => document.querySelector<HTMLElement>('.ptr-panel');
const rows = () => [...document.querySelectorAll('.ptr-row')];
const tabs = () => [...document.querySelectorAll<HTMLElement>('.ptr-tab')];

beforeEach(() => {
  document.body.replaceChildren();
});

describe('Panel', () => {
  test('nasce fechado, mostrando apenas o botao', () => {
    const panel = new Panel();

    expect(toggle()).not.toBeNull();
    expect(panelBox()?.style.display).toBe('none');
    expect(panel.isOpen).toBe(false);
  });

  test('abre e fecha ao clicar no botao', () => {
    const panel = new Panel();

    toggle()?.click();
    expect(panel.isOpen).toBe(true);
    expect(panelBox()?.style.display).toBe('flex');

    toggle()?.click();
    expect(panel.isOpen).toBe(false);
    expect(panelBox()?.style.display).toBe('none');
  });

  test('nao desenha conteudo enquanto esta fechado', () => {
    const panel = new Panel();
    panel.update({ field: [row()], party: [], biome: null, destinations: [], missingTypes: [] });

    expect(rows()).toHaveLength(0);
  });

  test('mostra os inimigos em campo ao abrir', () => {
    const panel = new Panel();
    panel.update({
      field: [row(), row({ name: 'Hoothoot' })],
      party: [],
      biome: null,
      destinations: [],
      missingTypes: [],
    });
    toggle()?.click();

    expect(rows()).toHaveLength(2);
    expect(document.body.textContent).toContain('Magikarp');
    expect(document.body.textContent).toContain('Bom');
  });

  test('troca de aba mostra o time', () => {
    const panel = new Panel();
    panel.update({
      field: [],
      party: [row({ name: 'Mawile' })],
      biome: null,
      destinations: [],
      missingTypes: [],
    });
    toggle()?.click();

    tabs()[1]?.click();

    expect(document.body.textContent).toContain('Mawile');
  });

  test('mostra os tipos sem cobertura no rodape do time', () => {
    const panel = new Panel();
    panel.update({
      field: [],
      party: [row({ name: 'Mawile' })],
      biome: null,
      destinations: [],
      missingTypes: ['Fogo', 'Água'],
    });
    toggle()?.click();
    tabs()[1]?.click();

    expect(document.body.textContent).toContain('Sem cobertura: Fogo, Água');
  });

  test('time que cobre tudo nao mostra rodape de cobertura', () => {
    const panel = new Panel();
    panel.update({
      field: [],
      party: [row({ name: 'Mawile' })],
      biome: null,
      destinations: [],
      missingTypes: [],
    });
    toggle()?.click();
    tabs()[1]?.click();

    expect(document.body.textContent).not.toContain('Sem cobertura');
  });

  test('avisa quando nao ha inimigo em campo', () => {
    const panel = new Panel();
    panel.update({ field: [], party: [], biome: null, destinations: [], missingTypes: [] });
    toggle()?.click();

    expect(document.body.textContent).toContain('Nenhum inimigo em campo');
  });

  test('agrupa o bioma por raridade', () => {
    const panel = new Panel();
    panel.update({
      field: [],
      party: [],
      biome: {
        name: 'Lago',
        groups: [
          { tier: 'BOSS', entries: [row({ name: 'Gyarados' })] },
          { tier: 'COMMON', entries: [row({ name: 'Magikarp' })] },
        ],
      },
      destinations: [],
      missingTypes: [],
    });
    toggle()?.click();
    tabs()[2]?.click();

    expect(document.body.textContent).toContain('Lago');
    expect(document.body.textContent).toContain('Chefe');
    expect(document.body.textContent).toContain('Comum');
  });

  test('lista os destinos com os destaques de cada um', () => {
    const panel = new Panel();
    panel.update({
      field: [],
      party: [],
      biome: null,
      destinations: [
        { biome: 2, name: 'Campo', novos: 1, total: 3, highlights: [row({ name: 'Ivysaur' })] },
        { biome: 9, name: 'Lago', novos: 0, total: 0, highlights: [] },
      ],
      missingTypes: [],
    });
    toggle()?.click();
    tabs()[3]?.click();

    expect(document.body.textContent).toContain('Campo');
    expect(document.body.textContent).toContain('Ivysaur');
    expect(document.body.textContent).toContain('Lago');
    expect(document.body.textContent).toContain('Sem encontros catalogados');
  });

  test('bioma sem rota avisa em vez de mostrar aba vazia', () => {
    const panel = new Panel();
    panel.update({ field: [], party: [], biome: null, destinations: [], missingTypes: [] });
    toggle()?.click();
    tabs()[3]?.click();

    expect(document.body.textContent).toContain('Nenhuma rota a partir daqui');
  });

  test('assinala quando o tier vem de mega ou gmax', () => {
    const panel = new Panel();
    panel.update({
      field: [row({ name: 'Mawile', reachName: 'Mawile-Mega', reachTier: 'OU', source: 'mega' })],
      party: [],
      biome: null,
      destinations: [],
      missingTypes: [],
    });
    toggle()?.click();

    expect(document.body.textContent).toContain('mega');
  });

  test('destroy remove tudo da pagina', () => {
    const panel = new Panel();
    panel.destroy();

    expect(document.querySelector('.ptr-root')).toBeNull();
  });
});

describe('golpes sugeridos', () => {
  test('a linha comeca fechada, sem mostrar golpes', () => {
    const panel = new Panel();
    panel.update({
      field: [row({ moves: ['Waterfall', 'Dragon Dance'] })],
      party: [],
      biome: null,
      destinations: [],
      missingTypes: [],
    });
    toggle()?.click();

    expect(document.querySelectorAll('.ptr-tag')).toHaveLength(0);
  });

  test('clicar na linha revela os golpes do Smogon', () => {
    const panel = new Panel();
    panel.update({
      field: [row({ moves: ['Waterfall', 'Dragon Dance'] })],
      party: [],
      biome: null,
      destinations: [],
      missingTypes: [],
    });
    toggle()?.click();

    document.querySelector<HTMLElement>('.ptr-row')?.click();

    const moves = [...document.querySelectorAll('.ptr-tag')].map((m) => m.textContent);
    expect(moves).toEqual(['Waterfall', 'Dragon Dance']);
  });

  test('clicar de novo esconde', () => {
    const panel = new Panel();
    panel.update({
      field: [row({ moves: ['Waterfall'] })],
      party: [],
      biome: null,
      destinations: [],
      missingTypes: [],
    });
    toggle()?.click();

    document.querySelector<HTMLElement>('.ptr-row')?.click();
    document.querySelector<HTMLElement>('.ptr-row')?.click();

    expect(document.querySelectorAll('.ptr-tag')).toHaveLength(0);
  });

  test('so uma linha fica aberta por vez', () => {
    const panel = new Panel();
    panel.update({
      field: [row({ key: '1', moves: ['A'] }), row({ key: '2', moves: ['B'] })],
      party: [],
      biome: null,
      destinations: [],
      missingTypes: [],
    });
    toggle()?.click();

    const linhas = () => [...document.querySelectorAll<HTMLElement>('.ptr-row')];
    linhas()[0]?.click();
    linhas()[1]?.click();

    const moves = [...document.querySelectorAll('.ptr-tag')].map((m) => m.textContent);
    expect(moves).toEqual(['B']);
  });

  test('a linha aberta mostra hidden ability e catch rate', () => {
    const panel = new Panel();
    panel.update({
      field: [row({ catchRate: 235, moves: ['Psychic'] })],
      party: [],
      biome: null,
      destinations: [],
      missingTypes: [],
    });
    toggle()?.click();

    document.querySelector<HTMLElement>('.ptr-row')?.click();

    expect(document.body.textContent).toContain('Captura');
  });

  test('sem hidden ability nem catch rate a linha de fatos nao existe', () => {
    const panel = new Panel();
    panel.update({
      field: [row({ moves: ['Psychic'] })],
      party: [],
      biome: null,
      destinations: [],
      missingTypes: [],
    });
    toggle()?.click();

    document.querySelector<HTMLElement>('.ptr-row')?.click();

    expect(document.querySelectorAll('.ptr-facts')).toHaveLength(0);
    expect(document.body.textContent).not.toMatch(/desconhecid/i);
  });

  test('especie sem set no Smogon diz isso em vez de ficar vazia', () => {
    const panel = new Panel();
    panel.update({
      field: [row({ moves: [] })],
      party: [],
      biome: null,
      destinations: [],
      missingTypes: [],
    });
    toggle()?.click();

    document.querySelector<HTMLElement>('.ptr-row')?.click();

    expect(document.body.textContent).toContain('Sem sets catalogados pelo Smogon');
  });
});
