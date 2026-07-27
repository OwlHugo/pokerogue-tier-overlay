import { SNOWBALL_ABILITIES } from '../../data/snowball.generated';
import type { PoolTier } from '../domain/biome';
import { catchText } from '../domain/catch-rate';
import { typeColorOf, typeNameOf } from '../domain/coverage';
import type { LocaleRef } from '../domain/locale-ref';
import type { SmogonBuild } from '../domain/moveset';
import type { Locale, NamesByLocale } from '../domain/names';
import { ratingColor, ratingLabel, ratingOf, ratingShort } from '../domain/rating';
import type { ReachableSource } from '../domain/reachable';
import { type StringKey, t } from '../domain/strings';
import type { Tier } from '../domain/tier';
import type { BiomeGroup, DestinationGroup, PokemonRow } from './views';

const PANEL_NAME = 'Guia';
const TOGGLE_OFFSET = 46;
const PANEL_HEIGHT_RATIO = 0.66;

export type TabId = 'field' | 'party' | 'biome' | 'destinations';

export interface PanelContent {
  field: PokemonRow[];
  party: PokemonRow[];
  biome: { id: number; groups: BiomeGroup[] } | null;
  destinations: DestinationGroup[];
  missingTypes: readonly string[];
}

const TAB_KEYS: Record<TabId, StringKey> = {
  field: 'tabField',
  party: 'tabParty',
  biome: 'tabBiome',
  destinations: 'tabDestinations',
};

const HINT_KEYS: Record<TabId, StringKey> = {
  field: 'hintField',
  party: 'hintParty',
  biome: 'hintBiome',
  destinations: 'hintDestinations',
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
.ptr-lang{cursor:pointer;padding:2px 8px;border-radius:6px;background:#2a2a31;border:1px solid #3c3c46;
  color:#8d8a83;font-size:10px;font-weight:800;letter-spacing:.08em}
.ptr-lang:hover{color:#f0b429;border-color:#f0b429}

.ptr-tabs{display:flex;gap:4px;padding:6px;background:#191920;border-bottom:1px solid #0c0c0f}
.ptr-tab{flex:1;padding:6px 4px;text-align:center;cursor:pointer;font-size:11.5px;color:#9a968d;
  background:#232329;border:1px solid #34343d;border-radius:8px;transition:all .1s}
.ptr-tab:hover{background:#2c2c34;color:#d8d4cb}
.ptr-tab[data-on="1"]{color:#1a1a1f;background:linear-gradient(180deg,#f5c74a,#e0a51f);
  border-color:#0c0c0f;box-shadow:0 2px 0 #0c0c0f;font-weight:800}

.ptr-hint{padding:7px 10px 2px;color:#8d8a83;font-size:10.5px;font-weight:600;line-height:1.35}
.ptr-legend{padding:5px 10px 6px;color:#6e6b65;font-size:9px;font-weight:600;letter-spacing:.02em;
  border-top:1px solid #2a2a31;background:#191920;text-align:center}

.ptr-body{overflow-y:auto;padding:5px 8px 10px;background:#141418}
.ptr-body::-webkit-scrollbar{width:9px}
.ptr-body::-webkit-scrollbar-thumb{background:#34343d;border-radius:9px;border:2px solid #141418}

.ptr-row{display:flex;flex-direction:column;gap:3px;padding:7px 9px;margin-bottom:4px;cursor:pointer;
  background:#202026;border:1px solid #31313a;border-left:4px solid #4d4d59;border-radius:8px;
  transition:border-color .1s,background .1s}
.ptr-row:hover{border-color:#f0b429;background:#26262e}
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
.ptr-tier-mini{padding:1px 5px;border-radius:4px;font-weight:800;font-size:9px;color:#9a968d;
  background:#26262e;border:1px solid #3c3c46}
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
.ptr-snow{background:rgba(34,197,94,.32);color:#bbf7d0}
.ptr-flag{margin-left:6px;padding:0 5px;border-radius:4px;background:rgba(0,0,0,.35);
  font-size:8.5px;letter-spacing:.06em;text-transform:uppercase;opacity:.9}
.ptr-strategy{background:linear-gradient(180deg,#3a3222,#2a2418);border-color:#6b5620;color:#f0b429}
.ptr-moves-empty{display:block;font-size:10.5px;color:#7d7a73;font-weight:500}

.ptr-group{margin:11px 3px 5px;color:#8d8a83;font-size:9px;text-transform:uppercase;
  letter-spacing:.13em;font-weight:800;display:flex;align-items:center;gap:7px}
.ptr-group::after{content:'';flex:1;height:1px;background:#31313a}
.ptr-empty{display:block;padding:18px 8px;text-align:center;color:#7d7a73;font-weight:600}
`;

const SNOWBALL = new Set(SNOWBALL_ABILITIES);

function ratingChip(tier: Tier | null, locale: Locale): HTMLElement {
  const rating = ratingOf(tier);
  const chip = document.createElement('span');
  chip.className = 'ptr-tier';
  chip.textContent = ratingLabel(rating, locale);
  chip.style.background = ratingColor(rating);
  return chip;
}

function tierChip(tier: Tier | null): HTMLElement {
  const chip = document.createElement('span');
  chip.className = 'ptr-tier-mini';
  chip.textContent = tier ?? '?';
  return chip;
}

function span(className: string, text: string): HTMLElement {
  const element = document.createElement('span');
  element.className = className;
  element.textContent = text;
  return element;
}

function rowElement(row: PokemonRow, locale: Locale): HTMLElement {
  const element = document.createElement('div');
  element.className = 'ptr-row';
  if (row.owned) element.dataset.owned = '1';

  const top = document.createElement('div');
  top.className = 'ptr-top';
  top.append(span('ptr-name', row.name));

  if (row.owned) top.append(span('ptr-owned', t('inTeam', locale)));

  for (const type of row.types) {
    const chip = span('ptr-type', typeNameOf(type, locale) ?? '?');
    chip.style.background = typeColorOf(type);
    top.append(chip);
  }

  top.append(ratingChip(row.reachTier, locale));
  element.append(top);

  const under = document.createElement('div');
  under.className = 'ptr-under';

  if (row.level !== null) under.append(span('ptr-lvl', `Nv.${row.level}`));

  const note = SOURCE_NOTE[row.source];
  if (row.reachName && row.reachName !== row.name) {
    const vira = t('becomes', locale);
    const texto = note ? `${vira} ${row.reachName} (${note})` : `${vira} ${row.reachName}`;
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

function miniRating(tier: Tier | null): HTMLElement | null {
  if (!tier) return null;
  const rating = ratingOf(tier);
  const chip = span('ptr-tier-mini', ratingShort(rating));
  chip.style.background = ratingColor(rating);
  chip.style.color = '#fff';
  chip.style.borderColor = 'rgba(0,0,0,.45)';
  return chip;
}

function step(text: string, tier: Tier | null, agora: boolean): HTMLElement {
  const chip = span(agora ? 'ptr-step ptr-step-now' : 'ptr-step', text);
  const mini = agora ? null : miniRating(tier);
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

function abilityChip(
  ability: PokemonRow['abilities'][number],
  row: PokemonRow,
  abilityNames: NamesByLocale,
  locale: Locale,
): HTMLElement | null {
  const emIngles = abilityNames.en[ability.id];
  const nome = abilityNames[locale][ability.id] ?? emIngles;
  if (!nome) return null;

  const neve = SNOWBALL.has(ability.id);
  const recomendada = !!emIngles && emIngles === row.recommendedAbility;
  const chip = span(neve || recomendada ? 'ptr-tag ptr-strategy' : 'ptr-tag', nome);

  if (ability.hidden) chip.append(span('ptr-flag', 'HA'));
  if (neve) chip.append(span('ptr-flag ptr-snow', t('snowball', locale)));
  else if (recomendada) chip.append(span('ptr-flag', t('recommended', locale)));

  return chip;
}

function abilityList(
  row: PokemonRow,
  abilityNames: NamesByLocale,
  locale: Locale,
): HTMLElement | null {
  if (!row.abilities.length) return null;

  const tags = div('ptr-tags');
  for (const ability of row.abilities) {
    const chip = abilityChip(ability, row, abilityNames, locale);
    if (chip) tags.append(chip);
  }

  return tags.childElementCount ? tags : null;
}

function tagList(textos: readonly string[]): HTMLElement {
  const tags = div('ptr-tags');
  for (const texto of textos) tags.append(span('ptr-tag', texto));
  return tags;
}

function setElement(set: SmogonBuild['sets'][number]): HTMLElement {
  const caixa = div('ptr-block');

  if (set.nature) caixa.append(span('ptr-facts ptr-set-head', `Nature ${set.nature}`));
  caixa.append(tagList(set.moves));

  return caixa;
}

function detailElement(row: PokemonRow, abilityNames: NamesByLocale, locale: Locale): HTMLElement {
  const box = div('ptr-detail');

  const path = pathElement(row);
  if (path) box.append(bloco(t('path', locale), [path]));

  if (row.upgrades.length) {
    const linhas = row.upgrades.map((u) =>
      span(
        'ptr-facts',
        `${u.source === 'mega' ? 'Mega' : 'Gigantamax'}: ${ratingLabel(ratingOf(u.tier), locale)} (${u.name})`,
      ),
    );
    box.append(bloco(t('upside', locale), linhas));
  }

  const abilities = abilityList(row, abilityNames, locale);
  if (abilities) {
    const conteudo: HTMLElement[] = [abilities];
    if (row.abilities.some((a) => SNOWBALL.has(a.id))) {
      conteudo.push(span('ptr-facts', t('snowballHint', locale)));
    }
    box.append(bloco(t('abilities', locale), conteudo));
  }

  box.append(bloco('Smogon', [tierChip(row.reachTier)]));

  const captura = catchText(row.catchRate, locale);
  if (captura) {
    box.append(
      bloco(t('inGame', locale), [
        span('ptr-facts', `${t('catch', locale)}: ${captura} (${row.catchRate})`),
      ]),
    );
  }

  const sets = row.build?.sets ?? [];
  if (sets.length) {
    box.append(bloco(t('smogonBuilds', locale), sets.map(setElement)));
  } else if (row.moves.length) {
    box.append(bloco(t('topMoves', locale), [tagList(row.moves)]));
  } else {
    box.append(bloco(t('topMoves', locale), [span('ptr-moves-empty', t('noSets', locale))]));
  }

  return box;
}

function rowSignature(row: PokemonRow): string {
  return `${row.key}|${row.level}|${row.reachTier}|${row.owned}`;
}

function signatureOf(content: PanelContent): string {
  return [
    content.field.map(rowSignature).join(','),
    content.party.map(rowSignature).join(','),
    String(content.biome?.id ?? ''),
    content.biome?.groups.map((g) => `${g.tier}:${g.entries.length}`).join(',') ?? '',
    content.destinations.map((d) => `${d.biome}:${d.novos}/${d.total}`).join(','),
    content.missingTypes.join(','),
  ].join('#');
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
  private readonly legend: HTMLElement;
  private readonly langButton: HTMLElement;
  private readonly tabs = new Map<TabId, HTMLElement>();
  private open = false;
  private active: TabId = 'field';
  private expanded: string | null = null;
  private signature = '';
  private content: PanelContent = {
    field: [],
    party: [],
    biome: null,
    destinations: [],
    missingTypes: [],
  };

  constructor(
    private readonly abilityNames: NamesByLocale = { pt: {}, en: {} },
    private readonly biomeNames: NamesByLocale = { pt: {}, en: {} },
    private readonly localeRef: LocaleRef = { current: 'pt' },
    private readonly host: HTMLElement = document.body,
  ) {
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

    this.langButton = span('ptr-lang', '');
    this.langButton.addEventListener('click', () => {
      this.localeRef.current = this.locale === 'pt' ? 'en' : 'pt';
      this.relabel();
      if (this.open) this.render();
    });
    head.append(this.langButton);

    const tabs = document.createElement('div');
    tabs.className = 'ptr-tabs';
    for (const id of ['field', 'party', 'biome', 'destinations'] as TabId[]) {
      const tab = span('ptr-tab', t(TAB_KEYS[id], this.locale));
      tab.addEventListener('click', () => this.select(id));
      this.tabs.set(id, tab);
      tabs.append(tab);
    }

    this.hint = span('ptr-hint', '');
    this.legend = span('ptr-legend', '');

    this.body = document.createElement('div');
    this.body.className = 'ptr-body';
    this.panel.append(head, tabs, this.hint, this.body, this.legend);
    this.root.append(this.toggle, this.panel);
    this.host.append(this.root);

    this.relabel();
    this.select('field');
  }

  private get locale(): Locale {
    return this.localeRef.current;
  }

  private biomeName(id: number): string | null {
    return this.biomeNames[this.locale][id] ?? this.biomeNames.en[id] ?? null;
  }

  private relabel(): void {
    this.langButton.textContent = this.locale === 'pt' ? 'EN' : 'PT';
    for (const [id, tab] of this.tabs) tab.textContent = t(TAB_KEYS[id], this.locale);
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
    const assinatura = signatureOf(content);
    if (assinatura === this.signature) return;

    this.signature = assinatura;
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
    const biomeId = this.content.biome?.id;
    this.subtitle.textContent =
      biomeId === undefined ? '—' : (this.biomeName(biomeId) ?? String(biomeId));
    this.hint.textContent = t(HINT_KEYS[this.active], this.locale);
    this.legend.textContent = t('legend', this.locale);
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
        emptyElement(
          this.active === 'field' ? t('noEnemy', this.locale) : t('emptyTeam', this.locale),
        ),
      );
      return;
    }
    for (const row of rows) this.body.append(...this.expandable(row));

    if (this.active === 'party' && this.content.missingTypes.length) {
      const gap = document.createElement('div');
      gap.className = 'ptr-group';
      gap.textContent = `${t('coverage', this.locale)}: ${this.content.missingTypes.join(', ')}`;
      this.body.append(gap);
    }
  }

  private expandable(row: PokemonRow): HTMLElement[] {
    const id = `${this.active}:${row.key}`;
    const element = rowElement(row, this.locale);
    element.addEventListener('click', () => {
      this.expanded = this.expanded === id ? null : id;
      this.render();
    });

    if (this.expanded !== id) return [element];

    return [element, detailElement(row, this.abilityNames, this.locale)];
  }

  private renderBiome(): void {
    const biome = this.content.biome;
    if (!biome?.groups.length) {
      this.body.append(emptyElement(t('noBiome', this.locale)));
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
      this.body.append(emptyElement(t('noRoutes', this.locale)));
      return;
    }

    for (const group of this.content.destinations) {
      const heading = document.createElement('div');
      heading.className = 'ptr-group';
      heading.textContent = this.biomeName(group.biome) ?? group.name;
      this.body.append(heading);

      if (!group.highlights.length) {
        this.body.append(
          emptyElement(group.total ? t('allOwned', this.locale) : t('noEncounters', this.locale)),
        );
        continue;
      }

      for (const entry of group.highlights) this.body.append(...this.expandable(entry));
    }
  }
}
