import { beforeEach, describe, expect, test } from 'vitest';
import { Panel } from '../src/hud/panel';
import type { PokemonRow } from '../src/hud/views';

const row = (over: Partial<PokemonRow> = {}): PokemonRow => ({
  name: 'Magikarp',
  level: 5,
  tier: 'LC',
  reachTier: 'RU',
  reachName: 'Gyarados',
  source: 'line',
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
    panel.update({ field: [row()], party: [], biome: null });

    expect(rows()).toHaveLength(0);
  });

  test('mostra os inimigos em campo ao abrir', () => {
    const panel = new Panel();
    panel.update({ field: [row(), row({ name: 'Hoothoot' })], party: [], biome: null });
    toggle()?.click();

    expect(rows()).toHaveLength(2);
    expect(document.body.textContent).toContain('Magikarp');
    expect(document.body.textContent).toContain('RU');
  });

  test('troca de aba mostra o time', () => {
    const panel = new Panel();
    panel.update({ field: [], party: [row({ name: 'Mawile' })], biome: null });
    toggle()?.click();

    tabs()[1]?.click();

    expect(document.body.textContent).toContain('Mawile');
  });

  test('avisa quando nao ha inimigo em campo', () => {
    const panel = new Panel();
    panel.update({ field: [], party: [], biome: null });
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
    });
    toggle()?.click();
    tabs()[2]?.click();

    expect(document.body.textContent).toContain('Lago');
    expect(document.body.textContent).toContain('Chefe');
    expect(document.body.textContent).toContain('Comum');
  });

  test('assinala quando o tier vem de mega ou gmax', () => {
    const panel = new Panel();
    panel.update({
      field: [row({ name: 'Mawile', reachName: 'Mawile-Mega', reachTier: 'OU', source: 'mega' })],
      party: [],
      biome: null,
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
