import { beforeEach, describe, expect, test } from 'vitest';
import { BadgeLayer, type BadgeSpec } from '../src/render/badge-layer';
import { type FakeContainer, FakeScene } from './support/fake-phaser';

let scene: FakeScene;
let field: FakeContainer;

beforeEach(() => {
  scene = new FakeScene();
  field = scene.makeContainer();
});

const spec = (key: string, overrides: Partial<BadgeSpec> = {}): BadgeSpec => ({
  key,
  text: `${key} texto`,
  tier: 'OU',
  parent: field,
  offset: { x: 0, y: -20 },
  scale: 0.5,
  ...overrides,
});

describe('BadgeLayer', () => {
  test('cria uma badge por spec e anexa ao container do jogo', () => {
    const layer = new BadgeLayer(scene);
    layer.reconcile([spec('a'), spec('b')]);

    expect(layer.size).toBe(2);
    expect(field.children).toHaveLength(2);
  });

  test('reconciliar com as mesmas chaves reaproveita os objetos existentes', () => {
    const layer = new BadgeLayer(scene);
    layer.reconcile([spec('a')]);
    const created = scene.created.length;

    layer.reconcile([spec('a')]);

    expect(scene.created.length).toBe(created);
    expect(layer.size).toBe(1);
  });

  test('atualiza o texto quando ele muda sem recriar o objeto', () => {
    const layer = new BadgeLayer(scene);
    layer.reconcile([spec('a', { text: 'antes' })]);
    const badge = scene.created[0];

    layer.reconcile([spec('a', { text: 'depois' })]);

    expect(scene.created).toHaveLength(1);
    expect(badge?.text).toBe('depois');
  });

  test('destroi as badges cujas chaves sumiram', () => {
    const layer = new BadgeLayer(scene);
    layer.reconcile([spec('a'), spec('b')]);
    const removed = scene.created.find((object) => object.text.startsWith('b texto'));

    layer.reconcile([spec('a')]);

    expect(layer.size).toBe(1);
    expect(removed?.destroyed).toBe(true);
    expect(field.children).toHaveLength(1);
  });

  test('recria a badge quando ela troca de container', () => {
    const layer = new BadgeLayer(scene);
    layer.reconcile([spec('a')]);
    const original = scene.created[0];
    const other = scene.makeContainer();

    layer.reconcile([spec('a', { parent: other })]);

    expect(original?.destroyed).toBe(true);
    expect(other.children).toHaveLength(1);
    expect(field.children).toHaveLength(0);
  });

  test('clear destroi tudo e zera a contagem', () => {
    const layer = new BadgeLayer(scene);
    layer.reconcile([spec('a'), spec('b'), spec('c')]);

    layer.clear();

    expect(layer.size).toBe(0);
    expect(field.children).toHaveLength(0);
    expect(scene.created.every((object) => object.destroyed)).toBe(true);
  });

  test('alternar de tela muitas vezes nao deixa objeto orfao', () => {
    const layer = new BadgeLayer(scene);

    for (let round = 0; round < 20; round += 1) {
      layer.reconcile([spec('a'), spec('b')]);
      layer.clear();
    }

    expect(layer.size).toBe(0);
    expect(field.children).toHaveLength(0);
    expect(scene.created.every((object) => object.destroyed)).toBe(true);
  });
});
