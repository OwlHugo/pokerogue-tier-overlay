import type { BiomeTable } from './domain/biome';
import type { MovesetTable } from './domain/moveset';
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

function overlayFor(scene: BattleScene, table: TierTable): Overlay {
  return new Overlay(
    [
      new BattleSurface(new BadgeLayer(scene), table),
      new StarterSurface(new BadgeLayer(scene), table),
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
  biomeNames: Record<number, string> = {},
  abilityNames: Record<number, string> = {},
): OverlayRunner {
  let overlay: Overlay | null = null;
  let hud: Hud | null = null;

  return {
    get started() {
      return overlay !== null;
    },
    tick() {
      const scene = battleSceneOf(game);
      if (!scene) return;
      overlay ??= overlayFor(scene, table);
      overlay.tick();
      hud ??= new Hud(table, biomes, movesets, biomeNames, abilityNames);
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
