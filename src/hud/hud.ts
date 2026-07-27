import type { BiomeTable } from '../domain/biome';
import type { MovesetTable } from '../domain/moveset';
import type { TierTable } from '../domain/tier-table';
import type { BattleScene } from '../game/pokerogue';
import { Panel } from './panel';
import { biomeView, fieldView, partyView } from './views';

const BIOME_LABELS = new Map<string, string>([
  ['TOWN', 'Cidade'],
  ['PLAINS', 'Planície'],
  ['GRASS', 'Campo'],
  ['TALL_GRASS', 'Mato alto'],
  ['METROPOLIS', 'Metrópole'],
  ['FOREST', 'Floresta'],
  ['SEA', 'Mar'],
  ['SWAMP', 'Pântano'],
  ['BEACH', 'Praia'],
  ['LAKE', 'Lago'],
  ['SEABED', 'Fundo do mar'],
  ['MOUNTAIN', 'Montanha'],
  ['BADLANDS', 'Terra devastada'],
  ['CAVE', 'Caverna'],
  ['DESERT', 'Deserto'],
  ['ICE_CAVE', 'Caverna de gelo'],
  ['MEADOW', 'Prado'],
  ['POWER_PLANT', 'Usina'],
  ['VOLCANO', 'Vulcão'],
  ['GRAVEYARD', 'Cemitério'],
  ['DOJO', 'Dojo'],
  ['FACTORY', 'Fábrica'],
  ['RUINS', 'Ruínas'],
  ['WASTELAND', 'Devastação'],
  ['ABYSS', 'Abismo'],
  ['SPACE', 'Espaço'],
  ['CONSTRUCTION_SITE', 'Construção'],
  ['JUNGLE', 'Selva'],
  ['FAIRY_CAVE', 'Caverna das fadas'],
  ['TEMPLE', 'Templo'],
  ['SLUM', 'Favela'],
  ['SNOWY_FOREST', 'Floresta nevada'],
  ['ISLAND', 'Ilha'],
  ['LABORATORY', 'Laboratório'],
  ['END', 'Fim'],
]);

export class Hud {
  private readonly panel = new Panel();

  constructor(
    private readonly tiers: TierTable,
    private readonly biomes: BiomeTable,
    private readonly movesets: MovesetTable = {},
  ) {}

  sync(scene: BattleScene): void {
    this.place();
    if (!this.panel.isOpen) return;

    const biomeId = scene.arena?.biomeId;
    const biome = biomeId === undefined ? null : this.biomes[biomeId];

    this.panel.update({
      field: fieldView(scene, this.tiers, this.movesets),
      party: partyView(scene, this.tiers, this.movesets),
      biome: biome
        ? {
            name: BIOME_LABELS.get(biome.name) ?? biome.name,
            groups: biomeView(biomeId as number, this.biomes, this.tiers, this.movesets),
          }
        : null,
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
