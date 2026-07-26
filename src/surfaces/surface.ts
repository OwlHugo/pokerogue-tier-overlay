import type { GameContext } from '../game/context';

export interface Surface {
  readonly name: string;
  matches(context: GameContext): boolean;
  sync(context: GameContext): void;
  clear(): void;
}
