import type { BiomeTable } from '../domain/biome';
import { typeNameOf } from '../domain/coverage';
import type { MovesetTable } from '../domain/moveset';
import type { TierTable } from '../domain/tier-table';
import type { BattleScene } from '../game/pokerogue';
import { Panel } from './panel';
import { biomeView, coverageView, destinationsView, fieldView, partyView } from './views';

export class Hud {
  private readonly panel = new Panel();

  constructor(
    private readonly tiers: TierTable,
    private readonly biomes: BiomeTable,
    private readonly movesets: MovesetTable = {},
    private readonly biomeNames: Record<number, string> = {},
    private readonly abilityNames: Record<number, string> = {},
  ) {}

  sync(scene: BattleScene): void {
    this.place();
    if (!this.panel.isOpen) return;

    const biomeId = scene.arena?.biomeId;
    const biome = biomeId === undefined ? null : this.biomes[biomeId];

    this.panel.update({
      field: fieldView(scene, this.tiers, this.movesets, this.abilityNames),
      party: partyView(scene, this.tiers, this.movesets, this.abilityNames),
      biome: biome
        ? {
            name: this.biomeNames[biomeId as number] ?? biome.name,
            groups: biomeView(biomeId as number, this.biomes, this.tiers, this.movesets),
          }
        : null,
      destinations: destinationsView(biomeId ?? null, this.biomes, this.tiers, this.movesets).map(
        (group) => ({ ...group, name: this.biomeNames[group.biome] ?? group.name }),
      ),
      missingTypes: coverageView(scene).flatMap((type) => typeNameOf(type) ?? []),
    });
  }

  destroy(): void {
    this.panel.destroy();
  }

  private place(): void {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    this.panel.placeAt({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
  }
}
