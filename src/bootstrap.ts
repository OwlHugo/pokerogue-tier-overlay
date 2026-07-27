import type { BiomeTable } from './domain/biome';
import { type LocaleRef, localeRef } from './domain/locale-ref';
import type { MovesetTable } from './domain/moveset';
import type { Locale, NamesByLocale } from './domain/names';
import type { TierTable } from './domain/tier-table';
import { contextOf } from './game/context';
import type { PhaserGame } from './game/phaser';
import type { BattleScene } from './game/pokerogue';
import { Hud } from './hud/hud';
import { Overlay } from './overlay';
import { BadgeLayer } from './render/badge-layer';
import { BattleSurface } from './surfaces/battle-surface';
import { StarterSurface } from './surfaces/starter-surface';

export const BATTLE_SCENE_KEY = 'battle';

export interface OverlayRunner {
  readonly started: boolean;
  tick(): void;
  destroy(): void;
}

function overlayFor(scene: BattleScene, table: TierTable, ref: LocaleRef): Overlay {
  return new Overlay(
    [
      new BattleSurface(new BadgeLayer(scene), table, ref),
      new StarterSurface(new BadgeLayer(scene), table, new BadgeLayer(scene), ref),
    ],
    () => contextOf(scene),
  );
}

function battleSceneOf(game: PhaserGame): BattleScene | null {
  return (game.scene.getScene(BATTLE_SCENE_KEY) as BattleScene | null) ?? null;
}

export function startOverlay(
  game: PhaserGame,
  table: TierTable,
  biomes: BiomeTable = {},
  movesets: MovesetTable = {},
  biomeNames: NamesByLocale = { pt: {}, en: {} },
  abilityNames: NamesByLocale = { pt: {}, en: {} },
  locale: Locale = 'pt',
): OverlayRunner {
  const ref = localeRef(locale);
  let overlay: Overlay | null = null;
  let hud: Hud | null = null;

  return {
    get started() {
      return overlay !== null;
    },
    tick() {
      const scene = battleSceneOf(game);
      if (!scene) return;
      overlay ??= overlayFor(scene, table, ref);
      overlay.tick();
      hud ??= new Hud(table, biomes, movesets, biomeNames, abilityNames, ref);
      hud.sync(scene);
    },
    destroy() {
      overlay?.destroy();
      hud?.destroy();
      overlay = null;
      hud = null;
    },
  };
}
