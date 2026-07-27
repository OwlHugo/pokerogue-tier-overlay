import type { PoolTier } from '../domain/biome';
import { typeColorOf, typeNameOf } from '../domain/coverage';
import type { ReachableSource } from '../domain/reachable';
import type { Tier } from '../domain/tier';
import { backgroundFor } from '../render/palette';
import type { BiomeGroup, DestinationGroup, PokemonRow } from './views';

const PANEL_NAME = 'Companheiro';
const TOGGLE_OFFSET = 46;
const PANEL_HEIGHT_RATIO = 0.66;

export type TabId = 'field' | 'party' | 'biome' | 'destinations';

export interface PanelContent {
  field: PokemonRow[];
  party: PokemonRow[];
  biome: { name: string; groups: BiomeGroup[] } | null;
  destinations: DestinationGroup[];
  missingTypes: readonly string[];
}

const TAB_LABELS: Record<TabId, string> = {
  field: 'Campo',
  party: 'Time',
  biome: 'Aqui',
  destinations: 'Rotas',
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
.ptr-root{position:fixed;inset:0;pointer-events:none;z-index:2147483000;
  font:600 12px/1.4 "Trebuchet MS",ui-rounded,system-ui,sans-serif;color:#20304a}

.ptr-toggle{position:absolute;pointer-events:auto;display:flex;align-items:center;gap:7px;
  padding:7px 14px 7px 11px;cursor:pointer;user-select:none;color:#eaf3ff;
  background:linear-gradient(180deg,#4a7fc4 0%,#2f5591 55%,#254576 100%);
  border:2px solid #16223a;border-radius:999px;
  box-shadow:0 3px 0 #16223a,0 6px 14px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.45);
  transition:transform .1s}
.ptr-toggle:active{transform:translateY(2px);box-shadow:0 1px 0 #16223a,0 3px 8px rgba(0,0,0,.4)}
.ptr-dot{width:8px;height:8px;border-radius:50%;background:#ffd34d;
  box-shadow:0 0 0 2px rgba(0,0,0,.35),0 0 8px #ffd34d}

.ptr-panel{position:absolute;pointer-events:auto;width:336px;display:flex;flex-direction:column;
  background:linear-gradient(180deg,#fdfeff 0%,#e9f1fb 100%);
  border:2px solid #16223a;border-radius:16px;overflow:hidden;
  box-shadow:0 4px 0 #16223a,0 16px 40px rgba(0,0,0,.55);
  opacity:0;transform:translateY(-8px) scale(.97);transform-origin:top left;
  transition:opacity .18s cubic-bezier(.2,.9,.3,1.2),transform .18s cubic-bezier(.2,.9,.3,1.2)}
.ptr-panel[data-open="1"]{opacity:1;transform:none}

.ptr-head{display:flex;align-items:center;gap:8px;padding:7px 12px;color:#fff;
  background:linear-gradient(180deg,#4a7fc4 0%,#2f5591 100%);
  border-bottom:2px solid #16223a;text-shadow:0 1px 0 rgba(0,0,0,.45)}
.ptr-title{flex:1;font-size:13px;letter-spacing:.03em}
.ptr-sub{font-size:10.5px;opacity:.85;font-weight:500}

.ptr-tabs{display:flex;gap:4px;padding:6px;background:#dce8f6;border-bottom:2px solid #b9cde4}
.ptr-tab{flex:1;padding:6px 4px;text-align:center;cursor:pointer;font-size:11.5px;color:#4a6a95;
  background:#eef5fd;border:1px solid #b9cde4;border-radius:9px;
  transition:background .1s,color .1s,transform .1s}
.ptr-tab:hover{background:#fff;transform:translateY(-1px)}
.ptr-tab[data-on="1"]{color:#fff;background:linear-gradient(180deg,#5a90d6,#33619f);
  border-color:#16223a;box-shadow:0 2px 0 #16223a}

.ptr-body{overflow-y:auto;padding:7px 8px 10px;background:#f2f7fd}
.ptr-body::-webkit-scrollbar{width:9px}
.ptr-body::-webkit-scrollbar-thumb{background:#b9cde4;border-radius:9px;border:2px solid #f2f7fd}

.ptr-row{display:flex;flex-direction:column;gap:3px;padding:6px 9px;margin-bottom:4px;cursor:pointer;
  background:#fff;border:1px solid #cddcee;border-left:5px solid #8fb3dd;border-radius:9px;
  box-shadow:0 1px 0 rgba(22,34,58,.08);transition:transform .08s,border-color .1s}
.ptr-row:hover{transform:translateX(2px);border-color:#5a90d6}
.ptr-row[data-owned="1"]{background:#eaeef3;opacity:.62}
.ptr-top{display:flex;align-items:center;gap:6px;width:100%}
.ptr-name{flex:1;min-width:66px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  font-size:12.5px;color:#1b2b45}
.ptr-under{display:flex;align-items:center;gap:6px;color:#5b7391;font-size:10.5px;font-weight:600;
  min-width:0}
.ptr-reach{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ptr-owned{font-size:9.5px;padding:1px 6px;border-radius:999px;background:#2f5591;color:#fff;
  letter-spacing:.03em;white-space:nowrap}
.ptr-lvl{color:#6f8299;font-size:10.5px;font-weight:800;white-space:nowrap}
.ptr-tier{padding:2px 7px;border-radius:6px;font-weight:800;font-size:10.5px;color:#fff;
  letter-spacing:.04em;border:1px solid rgba(0,0,0,.35);text-shadow:0 1px 0 rgba(0,0,0,.35);
  white-space:nowrap}
.ptr-type{padding:1px 6px;border-radius:5px;font-size:9.5px;color:#fff;font-weight:700;
  border:1px solid rgba(0,0,0,.3);text-shadow:0 1px 0 rgba(0,0,0,.35);white-space:nowrap}

.ptr-detail{margin:-2px 2px 7px;padding:9px 11px;background:#fff;
  border:1px solid #cddcee;border-radius:0 0 10px 10px;box-shadow:0 2px 0 rgba(22,34,58,.06)}
.ptr-detail-title{color:#2f5591;font-size:9.5px;text-transform:uppercase;letter-spacing:.11em;
  margin-bottom:5px;font-weight:800}
.ptr-path{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-bottom:9px}
.ptr-step{padding:3px 9px;border-radius:999px;font-size:10.5px;background:#eef5fd;
  border:1px solid #b9cde4;color:#28405f;font-weight:700}
.ptr-step-now{background:linear-gradient(180deg,#ffe27a,#f5c542);border-color:#a37b12;color:#4a3703}
.ptr-arrow{color:#8aa4c4;font-size:11px;font-weight:800}
.ptr-facts{color:#4a6a95;font-size:10.5px;margin-bottom:9px;font-weight:600}
.ptr-moves{display:flex;flex-wrap:wrap;gap:4px}
.ptr-move{padding:3px 9px;border-radius:6px;background:linear-gradient(180deg,#f7fbff,#e3edf9);
  border:1px solid #b9cde4;font-size:10.5px;color:#28405f;font-weight:700}
.ptr-moves-empty{font-size:10.5px;color:#7a8da5;font-weight:500}

.ptr-group{margin:10px 3px 5px;color:#2f5591;font-size:9.5px;text-transform:uppercase;
  letter-spacing:.11em;font-weight:800;display:flex;align-items:center;gap:7px}
.ptr-group::after{content:'';flex:1;height:2px;border-radius:2px;background:#c9daed}
.ptr-badge{padding:2px 8px;border-radius:999px;background:linear-gradient(180deg,#5fbf7a,#3d9a5a);
  color:#fff;font-size:9.5px;letter-spacing:.02em;text-transform:none;border:1px solid #1d5c32}
.ptr-empty{padding:18px 8px;text-align:center;color:#7a8da5;font-weight:600}
`;

function tierChip(tier: Tier | null): HTMLElement {
  const chip = document.createElement('span');
  chip.className = 'ptr-tier';
  chip.textContent = tier ?? '?';
  chip.style.background = backgroundFor(tier);
  return chip;
}

function span(className: string, text: string): HTMLElement {
  const element = document.createElement('span');
  element.className = className;
  element.textContent = text;
  return element;
}

function rowElement(row: PokemonRow): HTMLElement {
  const element = document.createElement('div');
  element.className = 'ptr-row';
  if (row.owned) element.dataset.owned = '1';

  const top = document.createElement('div');
  top.className = 'ptr-top';
  top.append(span('ptr-name', row.name));

  if (row.owned) top.append(span('ptr-owned', 'no time'));

  for (const type of row.types) {
    const chip = span('ptr-type', typeNameOf(type) ?? '?');
    chip.style.background = typeColorOf(type);
    top.append(chip);
  }

  top.append(tierChip(row.reachTier));
  element.append(top);

  const under = document.createElement('div');
  under.className = 'ptr-under';

  if (row.level !== null) under.append(span('ptr-lvl', `Nv.${row.level}`));

  const note = SOURCE_NOTE[row.source];
  if (row.reachName && row.reachName !== row.name) {
    const texto = note ? `vira ${row.reachName} (${note})` : `vira ${row.reachName}`;
    under.append(span('ptr-reach', texto));
  }

  if (under.childElementCount) element.append(under);
  return element;
}

function pathElement(row: PokemonRow): HTMLElement | null {
  if (!row.evolutions.length) return null;

  const path = document.createElement('div');
  path.className = 'ptr-path';

  const agora = span(
    'ptr-step ptr-step-now',
    row.level === null ? row.name : `${row.name} Nv.${row.level}`,
  );
  path.append(agora);

  for (const passo of row.evolutions) {
    path.append(span('ptr-arrow', '→'));
    path.append(span('ptr-step', passo.level > 1 ? `${passo.name} Nv.${passo.level}` : passo.name));
  }

  const note = SOURCE_NOTE[row.source];
  if (note && row.reachName) {
    path.append(span('ptr-arrow', '→'));
    path.append(span('ptr-step', `${row.reachName} (${note})`));
  }

  return path;
}

function detailElement(row: PokemonRow): HTMLElement {
  const box = document.createElement('div');
  box.className = 'ptr-detail';

  const path = pathElement(row);
  if (path) {
    box.append(span('ptr-detail-title', 'Como chega la'), path);
  }

  const facts: string[] = [];
  if (row.hiddenAbility) facts.push(`HA ${row.hiddenAbility}`);
  if (row.catchRate !== null) facts.push(`Captura ${row.catchRate}`);
  if (facts.length) box.append(span('ptr-facts', facts.join(' · ')));

  box.append(span('ptr-detail-title', 'Golpes mais usados no Smogon'));

  if (!row.moves.length) {
    box.append(span('ptr-moves-empty', 'Sem golpes catalogados pelo Smogon'));
    return box;
  }

  const list = document.createElement('div');
  list.className = 'ptr-moves';
  for (const move of row.moves) list.append(span('ptr-move', move));
  box.append(list);
  return box;
}

function emptyElement(message: string): HTMLElement {
  return span('ptr-empty', message);
}

export class Panel {
  private readonly root: HTMLElement;
  private readonly toggle: HTMLElement;
  private readonly panel: HTMLElement;
  private readonly body: HTMLElement;
  private readonly subtitle: HTMLElement;
  private readonly tabs = new Map<TabId, HTMLElement>();
  private open = false;
  private active: TabId = 'field';
  private expanded: string | null = null;
  private content: PanelContent = {
    field: [],
    party: [],
    biome: null,
    destinations: [],
    missingTypes: [],
  };

  constructor(private readonly host: HTMLElement = document.body) {
    this.root = document.createElement('div');
    this.root.className = 'ptr-root';

    const style = document.createElement('style');
    style.textContent = css;
    this.root.append(style);

    this.toggle = document.createElement('div');
    this.toggle.className = 'ptr-toggle';
    this.toggle.append(Object.assign(document.createElement('span'), { className: 'ptr-dot' }));
    this.toggle.append(span('', PANEL_NAME));
    this.toggle.addEventListener('click', () => this.setOpen(!this.open));

    this.panel = document.createElement('div');
    this.panel.className = 'ptr-panel';
    this.panel.style.display = 'none';

    const head = document.createElement('div');
    head.className = 'ptr-head';
    head.append(span('ptr-title', PANEL_NAME));
    this.subtitle = span('ptr-sub', '');
    head.append(this.subtitle);

    const tabs = document.createElement('div');
    tabs.className = 'ptr-tabs';
    for (const id of ['field', 'party', 'biome', 'destinations'] as TabId[]) {
      const tab = span('ptr-tab', TAB_LABELS[id]);
      tab.addEventListener('click', () => this.select(id));
      this.tabs.set(id, tab);
      tabs.append(tab);
    }

    this.body = document.createElement('div');
    this.body.className = 'ptr-body';
    this.panel.append(head, tabs, this.body);
    this.root.append(this.toggle, this.panel);
    this.host.append(this.root);

    this.select('field');
  }

  get isOpen(): boolean {
    return this.open;
  }

  placeAt(rect: { top: number; left: number; width: number; height: number }): void {
    const left = Math.max(rect.left, 0) + 10;

    this.toggle.style.top = `${rect.top + 10}px`;
    this.toggle.style.left = `${left}px`;
    this.panel.style.top = `${rect.top + TOGGLE_OFFSET}px`;
    this.panel.style.left = `${left}px`;
    this.panel.style.maxHeight = `${Math.max(rect.height * PANEL_HEIGHT_RATIO, 180)}px`;
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

    if (!open) {
      this.panel.dataset.open = '0';
      return;
    }

    this.render();
    requestAnimationFrame(() => {
      this.panel.dataset.open = '1';
    });
  }

  private select(id: TabId): void {
    this.active = id;
    for (const [key, tab] of this.tabs) tab.dataset.on = key === id ? '1' : '0';
    if (this.open) this.render();
  }

  private render(): void {
    this.subtitle.textContent = this.content.biome?.name ?? 'fora de uma run';
    this.body.replaceChildren();

    if (this.active === 'biome') {
      this.renderBiome();
      return;
    }

    if (this.active === 'destinations') {
      this.renderDestinations();
      return;
    }

    const rows = this.active === 'field' ? this.content.field : this.content.party;
    if (!rows.length) {
      this.body.append(
        emptyElement(this.active === 'field' ? 'Nenhum inimigo em campo' : 'Time vazio'),
      );
      return;
    }
    for (const row of rows) this.body.append(...this.expandable(row));

    if (this.active === 'party' && this.content.missingTypes.length) {
      const gap = document.createElement('div');
      gap.className = 'ptr-group';
      gap.textContent = `Sem cobertura: ${this.content.missingTypes.join(', ')}`;
      this.body.append(gap);
    }
  }

  private expandable(row: PokemonRow): HTMLElement[] {
    const id = `${this.active}:${row.key}`;
    const element = rowElement(row);
    element.addEventListener('click', () => {
      this.expanded = this.expanded === id ? null : id;
      this.render();
    });

    if (this.expanded !== id) return [element];

    return [element, detailElement(row)];
  }

  private renderBiome(): void {
    const biome = this.content.biome;
    if (!biome?.groups.length) {
      this.body.append(emptyElement('Entre numa run para ver o bioma'));
      return;
    }

    for (const group of biome.groups) {
      const heading = document.createElement('div');
      heading.className = 'ptr-group';
      heading.textContent = POOL_LABELS[group.tier];
      this.body.append(heading);
      for (const entry of group.entries) this.body.append(...this.expandable(entry));
    }
  }

  private renderDestinations(): void {
    if (!this.content.destinations.length) {
      this.body.append(emptyElement('Nenhuma rota a partir daqui'));
      return;
    }

    for (const group of this.content.destinations) {
      const heading = document.createElement('div');
      heading.className = 'ptr-group';
      heading.textContent = group.name;
      heading.append(span('ptr-badge', `${group.novos} novos de ${group.total}`));
      this.body.append(heading);

      if (!group.highlights.length) {
        this.body.append(
          emptyElement(group.total ? 'Voce ja tem todos daqui' : 'Sem encontros catalogados'),
        );
        continue;
      }

      for (const entry of group.highlights) this.body.append(...this.expandable(entry));
    }
  }
}
