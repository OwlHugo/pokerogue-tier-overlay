import type { DisplayContainer, Scene, TextObject, TextStyle } from '../../src/game/phaser';

export class FakeText implements TextObject {
  text: string;
  x: number;
  y: number;
  style: TextStyle;
  depth = 0;
  scale = 1;
  visible = true;
  destroyed = false;
  parent: FakeContainer | null = null;

  constructor(x: number, y: number, text: string, style: TextStyle) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.style = style;
  }

  setText(value: string): this {
    this.text = value;
    return this;
  }

  setPosition(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  setStyle(style: TextStyle): this {
    this.style = { ...this.style, ...style };
    return this;
  }

  setDepth(value: number): this {
    this.depth = value;
    return this;
  }

  setScale(value: number): this {
    this.scale = value;
    return this;
  }

  setOrigin(): this {
    return this;
  }

  setVisible(value: boolean): this {
    this.visible = value;
    return this;
  }

  destroy(): void {
    this.destroyed = true;
    this.parent?.remove(this);
    this.parent = null;
  }
}

export class FakeContainer implements DisplayContainer {
  x = 0;
  y = 0;
  visible = true;
  children: FakeText[] = [];

  add(child: FakeText): this {
    child.parent = this;
    this.children.push(child);
    return this;
  }

  remove(child: FakeText): this {
    this.children = this.children.filter((existing) => existing !== child);
    return this;
  }
}

export class FakeScene implements Scene {
  created: FakeText[] = [];

  add = {
    text: (x: number, y: number, text: string, style: TextStyle): FakeText => {
      const object = new FakeText(x, y, text, style);
      this.created.push(object);
      return object;
    },
  };

  makeContainer(): FakeContainer {
    return new FakeContainer();
  }
}
