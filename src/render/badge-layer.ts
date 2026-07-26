import type { Tier } from '../domain/tier';
import type { DisplayContainer, Scene, TextObject } from '../game/phaser';
import { BADGE_DEPTH, badgeStyle } from './palette';

export interface BadgeSpec {
  key: string;
  text: string;
  tier: Tier | null;
  parent: DisplayContainer;
  offset: { x: number; y: number };
  scale: number;
}

interface Badge {
  spec: BadgeSpec;
  object: TextObject;
}

export class BadgeLayer {
  private readonly badges = new Map<string, Badge>();

  constructor(private readonly scene: Scene) {}

  get size(): number {
    return this.badges.size;
  }

  reconcile(specs: readonly BadgeSpec[]): void {
    const wanted = new Set(specs.map((spec) => spec.key));

    for (const [key, badge] of this.badges) {
      if (!wanted.has(key)) {
        this.destroy(key, badge);
      }
    }

    for (const spec of specs) {
      const existing = this.badges.get(spec.key);
      if (existing && existing.spec.parent !== spec.parent) {
        this.destroy(spec.key, existing);
      }
      const current = this.badges.get(spec.key);
      if (current) {
        this.update(current, spec);
      } else {
        this.create(spec);
      }
    }
  }

  clear(): void {
    for (const [key, badge] of this.badges) {
      this.destroy(key, badge);
    }
  }

  private create(spec: BadgeSpec): void {
    const object = this.scene.add
      .text(spec.offset.x, spec.offset.y, spec.text, badgeStyle(spec.tier))
      .setOrigin(0.5, 1)
      .setDepth(BADGE_DEPTH)
      .setScale(spec.scale);

    spec.parent.add(object);
    this.badges.set(spec.key, { spec, object });
  }

  private update(badge: Badge, spec: BadgeSpec): void {
    const previous = badge.spec;
    if (previous.text !== spec.text || previous.tier !== spec.tier) {
      badge.object.setText(spec.text).setStyle(badgeStyle(spec.tier));
    }
    if (previous.offset.x !== spec.offset.x || previous.offset.y !== spec.offset.y) {
      badge.object.setPosition(spec.offset.x, spec.offset.y);
    }
    if (previous.scale !== spec.scale) {
      badge.object.setScale(spec.scale);
    }
    badge.spec = spec;
  }

  private destroy(key: string, badge: Badge): void {
    badge.spec.parent.remove(badge.object);
    badge.object.destroy();
    this.badges.delete(key);
  }
}
