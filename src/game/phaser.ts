export interface TextStyle {
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  padding?: { x: number; y: number };
}

export interface Destroyable {
  destroy(): void;
}

export interface TextObject extends Destroyable {
  setText(value: string): this;
  setPosition(x: number, y: number): this;
  setStyle(style: TextStyle): this;
  setDepth(value: number): this;
  setScale(value: number): this;
  setOrigin(x?: number, y?: number): this;
  setVisible(value: boolean): this;
}

export interface DisplayContainer {
  x: number;
  y: number;
  visible: boolean;
  add(child: TextObject): unknown;
  remove(child: TextObject): unknown;
}

export interface Scene {
  add: {
    text(x: number, y: number, text: string, style: TextStyle): TextObject;
  };
}

export interface PhaserGame {
  scene: { getScene(key: string): unknown };
}

export type BootMethod = (this: PhaserGame, ...args: never[]) => unknown;
export type StepMethod = (this: { game: PhaserGame }, ...args: never[]) => unknown;

export interface PhaserNamespace {
  Game: { prototype: { boot: BootMethod } };
  Scenes: { Systems: { prototype: { step: StepMethod } } };
}

export interface PhaserHost {
  Phaser?: PhaserNamespace;
}
