import type { BattleScene, Ui } from './pokerogue';

export interface GameContext {
  scene: BattleScene;
  handlerName: string | null;
}

export function activeHandlerName(ui: Ui): string | null {
  return ui.handlers[ui.mode]?.constructor.name ?? null;
}

export function contextOf(scene: BattleScene): GameContext {
  return { scene, handlerName: activeHandlerName(scene.ui) };
}
