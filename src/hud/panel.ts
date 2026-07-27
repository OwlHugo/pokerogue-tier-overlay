import type { PoolTier } from '../domain/biome';
import { typeColorOf, typeNameOf } from '../domain/coverage';
import type { SmogonBuild } from '../domain/moveset';
import type { ReachableSource } from '../domain/reachable';
import type { Tier } from '../domain/tier';
import { backgroundFor } from '../render/palette';
import type { BiomeGroup, DestinationGroup, PokemonRow } from './views';

const PANEL_NAME = 'Guia';
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
  field: 'Inimigo',
  party: 'Time',
  biome: 'Bioma',
  destinations: 'Destinos',
};

const TAB_HINTS: Record<TabId, string> = {
  field: 'Quem está na sua frente agora.',
  party: 'Os seis que você carrega, e o que falta neles.',
  biome: 'Tudo que pode aparecer no bioma onde você está.',
  destinations: 'Para onde dá pra viajar daqui, e o que tem de novo em cada lugar.',
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
  font:600 12px/1.45 "Trebuchet MS",ui-rounded,system-ui,sans-serif;color:#e6e3dc}

.ptr-toggle{position:absolute;pointer-events:auto;display:flex;align-items:center;gap:7px;
  padding:7px 14px 7px 11px;cursor:pointer;user-select:none;color:#f3edde;
  background:linear-gradient(180deg,#3a3a42 0%,#26262c 55%,#1a1a1f 100%);
  border:2px solid #0c0c0f;border-radius:999px;
  box-shadow:0 3px 0 #0c0c0f,0 6px 16px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.14);
  transition:transform .1s,border-color .1s}
.ptr-toggle:hover{border-color:#f0b429}
.ptr-toggle:active{transform:translateY(2px);box-shadow:0 1px 0 #0c0c0f}
.ptr-dot{width:8px;height:8px;border-radius:50%;background:#f0b429;
  box-shadow:0 0 0 2px rgba(0,0,0,.5),0 0 9px #f0b429}

.ptr-panel{position:absolute;pointer-events:auto;width:344px;display:flex;flex-direction:column;
  background:linear-gradient(180deg,#1c1c21 0%,#141418 100%);
  border:2px solid #0c0c0f;border-radius:14px;overflow:hidden;
  box-shadow:0 4px 0 #0c0c0f,0 18px 44px rgba(0,0,0,.66);
  opacity:0;transform:translateY(-8px) scale(.97);transform-origin:top left;
  transition:opacity .18s cubic-bezier(.2,.9,.3,1.2),transform .18s cubic-bezier(.2,.9,.3,1.2)}
.ptr-panel[data-open="1"]{opacity:1;transform:none}

.ptr-head{display:flex;align-items:baseline;gap:8px;padding:8px 13px;
  background:linear-gradient(180deg,#2a2a31,#1e1e24);border-bottom:2px solid #0c0c0f}
.ptr-title{flex:1;font-size:12.5px;color:#f0b429;letter-spacing:.05em;text-transform:uppercase}
.ptr-sub{font-size:10.5px;color:#8d8a83;font-weight:600}

.ptr-tabs{display:flex;gap:4px;padding:6px;background:#191920;border-bottom:1px solid #0c0c0f}
.ptr-tab{flex:1;padding:6px 4px;text-align:center;cursor:pointer;font-size:11.5px;color:#9a968d;
  background:#232329;border:1px solid #34343d;border-radius:8px;transition:all .1s}
.ptr-tab:hover{background:#2c2c34;color:#d8d4cb}
.ptr-tab[data-on="1"]{color:#1a1a1f;background:linear-gradient(180deg,#f5c74a,#e0a51f);
  border-color:#0c0c0f;box-shadow:0 2px 0 #0c0c0f;font-weight:800}

.ptr-hint{padding:7px 10px 2px;color:#8d8a83;font-size:10.5px;font-weight:600;line-height:1.35}

.ptr-body{overflow-y:auto;padding:5px 8px 10px;background:#141418}
.ptr-body::-webkit-scrollbar{width:9px}
.ptr-body::-webkit-scrollbar-thumb{background:#34343d;border-radius:9px;border:2px solid #141418}

.ptr-row{display:flex;flex-direction:column;gap:3px;padding:7px 9px;margin-bottom:4px;cursor:pointer;
  background:#202026;border:1px solid #31313a;border-left:4px solid #4d4d59;border-radius:8px;
  transition:transform .08s,border-color .1s,background .1s}
.ptr-row:hover{transform:translateX(2px);border-color:#f0b429;background:#26262e}
.ptr-row[data-owned="1"]{opacity:.45}
.ptr-top{display:flex;align-items:center;gap:6px;width:100%}
.ptr-name{flex:1;min-width:66px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  font-size:12.5px;color:#f2efe8}
.ptr-under{display:flex;align-items:center;gap:6px;color:#8d8a83;font-size:10.5px;font-weight:600;
  min-width:0}
.ptr-reach{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ptr-owned{font-size:9.5px;padding:1px 6px;border-radius:999px;background:#4d4d59;color:#d8d4cb;
  letter-spacing:.03em;white-space:nowrap}
.ptr-lvl{color:#f0b429;font-size:10.5px;font-weight:800;white-space:nowrap}
.ptr-tier{padding:2px 7px;border-radius:5px;font-weight:800;font-size:10.5px;color:#fff;
  letter-spacing:.04em;border:1px solid rgba(0,0,0,.5);text-shadow:0 1px 0 rgba(0,0,0,.5);
  white-space:nowrap}
.ptr-tier-mini{padding:1px 5px;border-radius:4px;font-weight:800;font-size:9px;color:#fff;
  border:1px solid rgba(0,0,0,.5);text-shadow:0 1px 0 rgba(0,0,0,.5)}
.ptr-type{padding:1px 6px;border-radius:4px;font-size:9.5px;color:#fff;font-weight:700;
  border:1px solid rgba(0,0,0,.45);text-shadow:0 1px 0 rgba(0,0,0,.45);white-space:nowrap}

.ptr-detail{display:block;margin:-2px 2px 8px;padding:10px 11px;background:#191920;
  border:1px solid #31313a;border-radius:0 0 9px 9px}
.ptr-detail-title{display:block;color:#f0b429;font-size:9px;text-transform:uppercase;
  letter-spacing:.13em;margin:0 0 6px;font-weight:800}
.ptr-detail-title + *{margin-top:0}
.ptr-block{display:block;margin-bottom:11px}
.ptr-path{display:flex;flex-wrap:wrap;align-items:center;gap:4px}
.ptr-step{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:999px;
  font-size:10.5px;background:#26262e;border:1px solid #3c3c46;color:#ddd9d1;font-weight:700}
.ptr-step-now{background:linear-gradient(180deg,#f5c74a,#e0a51f);border-color:#8a6510;color:#241a02}
.ptr-arrow{color:#5c5c68;font-size:11px;font-weight:800}
.ptr-facts{display:block;color:#b6b2a9;font-size:10.5px;font-weight:600}
.ptr-facts b{color:#f0b429;font-weight:800}
.ptr-tags{display:flex;flex-wrap:wrap;gap:4px}
.ptr-tag{padding:3px 9px;border-radius:6px;background:#26262e;border:1px solid #3c3c46;
  font-size:10.5px;color:#ddd9d1;font-weight:700}
.ptr-set-head{display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap}
.ptr-strategy{background:linear-gradient(180deg,#3a3222,#2a2418);border-color:#6b5620;color:#f0b429}
.ptr-moves-empty{display:block;font-size:10.5px;color:#7d7a73;font-weight:500}

.ptr-group{margin:11px 3px 5px;color:#8d8a83;font-size:9px;text-transform:uppercase;
  letter-spacing:.13em;font-weight:800;display:flex;align-items:center;gap:7px}
.ptr-group::after{content:'';flex:1;height:1px;background:#31313a}
.ptr-badge{padding:2px 8px;border-radius:999px;background:#2a2418;color:#f0b429;
  font-size:9.5px;letter-spacing:.02em;text-transform:none;border:1px solid #6b5620}
.ptr-empty{display:block;padding:18px 8px;text-align:center;color:#7d7a73;font-weight:600}
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

function div(className: string): HTMLElement {
  const element = document.createElement('div');
  element.className = className;
  return element;
}

function miniTier(tier: Tier | null): HTMLElement | null {
  if (!tier) return null;
  const chip = span('ptr-tier-mini', tier);
  chip.style.background = backgroundFor(tier);
  return chip;
}

function step(text: string, tier: Tier | null, agora: boolean): HTMLElement {
  const chip = span(agora ? 'ptr-step ptr-step-now' : 'ptr-step', text);
  const mini = agora ? null : miniTier(tier);
  if (mini) chip.append(mini);
  return chip;
}

function pathElement(row: PokemonRow): HTMLElement | null {
  if (!row.evolutions.length) return null;

  const path = div('ptr-path');
  path.append(step(row.level === null ? row.name : `${row.name} Nv.${row.level}`, row.tier, true));

  for (const passo of row.evolutions) {
    path.append(span('ptr-arrow', '\u2192'));
    path.append(
      step(passo.level > 1 ? `${passo.name} Nv.${passo.level}` : passo.name, passo.tier, false),
    );
  }

  const note = SOURCE_NOTE[row.source];
  if (note && row.reachName) {
    path.append(span('ptr-arrow', '\u2192'));
    path.append(step(`${row.reachName} (${note})`, row.reachTier, false));
  }

  return path;
}

function bloco(titulo: string, conteudo: readonly HTMLElement[]): HTMLElement {
  const caixa = div('ptr-block');
  caixa.append(span('ptr-detail-title', titulo), ...conteudo);
  return caixa;
}

function inGameFacts(row: PokemonRow): readonly string[] {
  const facts: string[] = [];
  if (row.hiddenAbility) facts.push(`HA ${row.hiddenAbility}`);
  if (row.catchRate !== null) facts.push(`Captura ${row.catchRate}`);
  return facts;
}

function tagList(textos: readonly string[]): HTMLElement {
  const tags = div('ptr-tags');
  for (const texto of textos) tags.append(span('ptr-tag', texto));
  return tags;
}

function setElement(set: SmogonBuild['sets'][number]): HTMLElement {
  const caixa = div('ptr-block');

  const cabecalho = div('ptr-set-head');
  cabecalho.append(span('ptr-tag ptr-strategy', set.name));
  if (set.nature) cabecalho.append(span('ptr-facts', `Nature ${set.nature}`));
  caixa.append(cabecalho, tagList(set.moves));

  return caixa;
}

function detailElement(row: PokemonRow): HTMLElement {
  const box = div('ptr-detail');

  const path = pathElement(row);
  if (path) box.append(bloco('Como chega lá', [path]));

  const facts = inGameFacts(row);
  if (facts.length) box.append(bloco('No jogo', [span('ptr-facts', facts.join(' \u00b7 '))]));

  const sets = row.build?.sets ?? [];
  if (sets.length) {
    box.append(bloco('Como o Smogon monta', sets.map(setElement)));
  } else if (row.moves.length) {
    box.append(bloco('Golpes mais usados', [tagList(row.moves)]));
  } else {
    box.append(bloco('Golpes', [span('ptr-moves-empty', 'Sem sets catalogados pelo Smogon')]));
  }

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
  private readonly hint: HTMLElement;
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
    this.subtitle = span('ptr-title', '');
    head.append(this.subtitle);
    head.append(span('ptr-sub', 'PokeRogue'));

    const tabs = document.createElement('div');
    tabs.className = 'ptr-tabs';
    for (const id of ['field', 'party', 'biome', 'destinations'] as TabId[]) {
      const tab = span('ptr-tab', TAB_LABELS[id]);
      tab.addEventListener('click', () => this.select(id));
      this.tabs.set(id, tab);
      tabs.append(tab);
    }

    this.hint = span('ptr-hint', '');

    this.body = document.createElement('div');
    this.body.className = 'ptr-body';
    this.panel.append(head, tabs, this.hint, this.body);
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
    this.hint.textContent = TAB_HINTS[this.active];
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
          emptyElement(group.total ? 'Você já tem todos daqui' : 'Sem encontros catalogados'),
        );
        continue;
      }

      for (const entry of group.highlights) this.body.append(...this.expandable(entry));
    }
  }
}
