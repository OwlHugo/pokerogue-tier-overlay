import type { PoolTier } from '../domain/biome';
import type { ReachableSource } from '../domain/reachable';
import type { Tier } from '../domain/tier';
import { backgroundFor } from '../render/palette';
import type { BiomeGroup, PokemonRow } from './views';

export type TabId = 'field' | 'party' | 'biome';

export interface PanelContent {
  field: PokemonRow[];
  party: PokemonRow[];
  biome: { name: string; groups: BiomeGroup[] } | null;
}

const TAB_LABELS: Record<TabId, string> = {
  field: 'Em campo',
  party: 'Meu time',
  biome: 'Bioma',
};

const POOL_LABELS: Record<PoolTier, string> = {
  BOSS: 'Chefe',
  ULTRA_RARE: 'Ultra raro',
  SUPER_RARE: 'Super raro',
  RARE: 'Raro',
  UNCOMMON: 'Incomum',
  COMMON: 'Comum',
};

const SOURCE_NOTE: Record<ReachableSource, string> = {
  line: '',
  mega: 'mega',
  gmax: 'gmax',
};

const css = `
.ptr-root{position:fixed;z-index:2147483000;font:500 12px/1.45 ui-sans-serif,system-ui,sans-serif;color:#e8e8ea}
.ptr-toggle{position:absolute;display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:999px;
  background:rgba(18,18,22,.82);border:1px solid rgba(255,255,255,.14);cursor:pointer;user-select:none;
  backdrop-filter:blur(6px);transition:background .15s}
.ptr-toggle:hover{background:rgba(30,30,38,.94)}
.ptr-dot{width:7px;height:7px;border-radius:50%;background:#22c55e}
.ptr-panel{position:absolute;width:310px;max-height:min(70vh,520px);display:flex;flex-direction:column;
  background:rgba(16,16,20,.95);border:1px solid rgba(255,255,255,.14);border-radius:10px;overflow:hidden;
  box-shadow:0 12px 34px rgba(0,0,0,.5);backdrop-filter:blur(10px)}
.ptr-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,.1)}
.ptr-tab{flex:1;padding:8px 6px;text-align:center;cursor:pointer;color:#9b9ba4;border-bottom:2px solid transparent}
.ptr-tab[data-on="1"]{color:#fff;border-bottom-color:#6366f1;background:rgba(99,102,241,.1)}
.ptr-body{overflow-y:auto;padding:8px}
.ptr-row{display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:6px}
.ptr-row:nth-child(odd){background:rgba(255,255,255,.035)}
.ptr-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ptr-lvl{color:#8b8b94;font-size:11px}
.ptr-tier{padding:1px 7px;border-radius:4px;font-weight:700;font-size:11px;letter-spacing:.02em}
.ptr-via{color:#a5a5ae;font-size:11px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ptr-group{margin:6px 2px 3px;color:#8b8b94;font-size:11px;text-transform:uppercase;letter-spacing:.06em}
.ptr-empty{padding:16px 8px;text-align:center;color:#8b8b94}
`;

function tierChip(tier: Tier | null): HTMLElement {
  const chip = document.createElement('span');
  chip.className = 'ptr-tier';
  chip.textContent = tier ?? '?';
  chip.style.background = backgroundFor(tier);
  return chip;
}

function rowElement(row: PokemonRow): HTMLElement {
  const element = document.createElement('div');
  element.className = 'ptr-row';

  const name = document.createElement('span');
  name.className = 'ptr-name';
  name.textContent = row.name;
  element.append(name);

  if (row.level !== null) {
    const level = document.createElement('span');
    level.className = 'ptr-lvl';
    level.textContent = `Nv.${row.level}`;
    element.append(level);
  }

  const note = SOURCE_NOTE[row.source];
  const via = row.reachName && row.reachName !== row.name ? row.reachName : note;
  if (via) {
    const detail = document.createElement('span');
    detail.className = 'ptr-via';
    detail.textContent = note ? `${via} (${note})` : via;
    element.append(detail);
  }

  element.append(tierChip(row.reachTier));
  return element;
}

function emptyElement(message: string): HTMLElement {
  const element = document.createElement('div');
  element.className = 'ptr-empty';
  element.textContent = message;
  return element;
}

export class Panel {
  private readonly root: HTMLElement;
  private readonly toggle: HTMLElement;
  private readonly panel: HTMLElement;
  private readonly body: HTMLElement;
  private readonly tabs = new Map<TabId, HTMLElement>();
  private open = false;
  private active: TabId = 'field';
  private content: PanelContent = { field: [], party: [], biome: null };

  constructor(private readonly host: HTMLElement = document.body) {
    this.root = document.createElement('div');
    this.root.className = 'ptr-root';

    const style = document.createElement('style');
    style.textContent = css;
    this.root.append(style);

    this.toggle = document.createElement('div');
    this.toggle.className = 'ptr-toggle';
    this.toggle.append(Object.assign(document.createElement('span'), { className: 'ptr-dot' }));
    this.toggle.append(Object.assign(document.createElement('span'), { textContent: 'Tiers' }));
    this.toggle.addEventListener('click', () => this.setOpen(!this.open));

    this.panel = document.createElement('div');
    this.panel.className = 'ptr-panel';
    this.panel.style.display = 'none';

    const tabs = document.createElement('div');
    tabs.className = 'ptr-tabs';
    for (const id of ['field', 'party', 'biome'] as TabId[]) {
      const tab = document.createElement('div');
      tab.className = 'ptr-tab';
      tab.textContent = TAB_LABELS[id];
      tab.addEventListener('click', () => this.select(id));
      this.tabs.set(id, tab);
      tabs.append(tab);
    }

    this.body = document.createElement('div');
    this.body.className = 'ptr-body';
    this.panel.append(tabs, this.body);
    this.root.append(this.toggle, this.panel);
    this.host.append(this.root);

    this.select('field');
  }

  get isOpen(): boolean {
    return this.open;
  }

  placeAt(rect: { top: number; left: number; width: number }): void {
    const right = window.innerWidth - (rect.left + rect.width);
    this.toggle.style.top = `${rect.top + 8}px`;
    this.toggle.style.right = `${right + 8}px`;
    this.panel.style.top = `${rect.top + 40}px`;
    this.panel.style.right = `${right + 8}px`;
  }

  update(content: PanelContent): void {
    this.content = content;
    if (this.open) this.render();
  }

  destroy(): void {
    this.root.remove();
  }

  private setOpen(open: boolean): void {
    this.open = open;
    this.panel.style.display = open ? 'flex' : 'none';
    if (open) this.render();
  }

  private select(id: TabId): void {
    this.active = id;
    for (const [key, tab] of this.tabs) tab.dataset.on = key === id ? '1' : '0';
    if (this.open) this.render();
  }

  private render(): void {
    this.body.replaceChildren();

    if (this.active === 'biome') {
      this.renderBiome();
      return;
    }

    const rows = this.active === 'field' ? this.content.field : this.content.party;
    if (!rows.length) {
      this.body.append(
        emptyElement(this.active === 'field' ? 'Nenhum inimigo em campo' : 'Time vazio'),
      );
      return;
    }
    this.body.append(...rows.map(rowElement));
  }

  private renderBiome(): void {
    const biome = this.content.biome;
    if (!biome?.groups.length) {
      this.body.append(emptyElement('Bioma desconhecido'));
      return;
    }

    const title = document.createElement('div');
    title.className = 'ptr-group';
    title.textContent = biome.name;
    this.body.append(title);

    for (const group of biome.groups) {
      const heading = document.createElement('div');
      heading.className = 'ptr-group';
      heading.textContent = POOL_LABELS[group.tier];
      this.body.append(heading, ...group.entries.map(rowElement));
    }
  }
}
