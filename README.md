*Leia em [português](README.pt-BR.md).*

# PokéRogue Tier Overlay

Shows, inside the game itself, **the best competitive Smogon tier each Pokémon can reach** —
counting evolution, Mega Evolution and Gigantamax.

A Magikarp is LC and looks like trash. It becomes Gyarados. The overlay tells you that before
you decide to spend the ball.

```
Magikarp   LC → RU (Gyarados)
```

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) or
   [Violentmonkey](https://violentmonkey.github.io/).
2. Install the script from Greasyfork *(link once published)*.
3. Open [pokerogue.net](https://pokerogue.net/). Done.

Works on Chrome, Firefox, Edge and Safari on desktop, and on Firefox for Android.

### On mobile, or anywhere you can't install an extension

Chrome for Android supports no extensions at all, and Kiwi Browser, which used to be the way
out, is discontinued. For those cases there is a bookmarklet: a bookmark you tap after the
game loads.

```bash
npm run build:bookmarklet
```

That generates `dist/bookmarklet.txt`. Create a bookmark and paste the contents into the
address field. Open PokéRogue, tap the bookmark, and the overlay turns on.

It works **because capturing the game does not depend on early injection** (see below). The
trade-off is that you have to tap the bookmark on every page load, and that the URL is around
180 kB — some browsers dislike bookmarks that long.

## Where it shows up

| Screen | What it shows |
|---|---|
| Battle | A badge above each enemy Pokémon, with the current tier and the best reachable tier |
| Starter select | The best reachable tier on every icon in the grid, following filters and scroll |
| Panel ("Guia" button) | Tabs for **Enemy**, **Team**, **Biome** and **Destinations**; click a row for the evolution line with the tier of every step, plus Smogon builds |

The panel is closed by default, a small button in the corner of the game. Data only appears
when you ask for it — the game screen stays the game's.

### What counts as "reachable"

PokéRogue unlocks Mega Evolution and Gigantamax, so the tier that matters is not the species'
tier: **Mawile is ZU, but Mawile-Mega is OU. Kangaskhan-Mega is Uber. Charizard-Gmax is AG.**
The overlay accounts for all three — evolution, mega and gmax — and shows whichever gives the
best result.

Reach counts only what you can obtain **starting from that Pokémon**: a Vaporeon does not turn
back into an Eevee, so it does not "reach" Eevee's Gmax nor the other eeveelutions.

Fused Pokémon show the best tier across both lines. A species Smogon does not catalog shows up
as `?` — the overlay never invents a tier.

### Moves

Clicking any Pokémon in the panel opens the moves Smogon uses most on it. That's 987 species
distilled from the official sets: we keep only the 6 most recurring moves of each, which cuts
1.1 MB of sets down to 75 kB and keeps everything working offline during a run.

This is a competitive suggestion, not a list of what the Pokémon learns in PokéRogue — the
game has its own movepool.

**What the overlay deliberately leaves out of a Smogon set**, because it does not exist or is
not actionable in PokéRogue:

| Smogon data | Why it's out |
|---|---|
| EVs | PokéRogue **has no EVs**. Stats rise through vitamins, which are reward modifiers |
| Held item | Items come from a pool per `ModifierTier`, not the competitive catalog. There are no Z-crystals |
| IVs | They exist, but are rolled at the encounter. You don't choose them |
| Z-move and Dynamax sets | Mechanics the game doesn't implement |

**Nature stays**, because it's the only actionable one: PokéRogue has Mints in the modifier
pool.

That same expanded row shows the **hidden ability** and the **catch rate**, read straight from
the object the game holds in memory — so they track whatever version you're running, with no
generated table in between. A species without a hidden ability simply doesn't show the line:
the overlay omits rather than fills in.

### Biome tab

Lists what appears in the current biome, grouped by rarity (Boss, Ultra rare, … Common) and
sorted by best reachable tier — so you can decide whether it's worth staying or switching
routes. Encounter pools are extracted from PokéRogue's own code by `npm run build:biomes`,
from a **pinned commit** recorded in `data/pokerogue-source.json`. Without the pin, the table
would change on its own whenever the game updated.

### Type coverage

The **Team** tab ends with the types nobody on your team has. A team of nothing but Water and
Grass shows `Sem cobertura: Fogo, Elétrico, ...` — that's the hole the next catch could fill.

An empty team shows nothing. With no team, "every type is missing" would be a true and useless
sentence.

### Destinations tab

PokéRogue does not let you go to any biome you like: each one has its own exits, declared in
the game's code as `biomeLinks`. Plains leads to Grass, Metropolis and Lake, and nowhere else.

This tab shows the destinations reachable from where you are, and in each of them the six
Pokémon with the best reachable tier. It's the routing decision, settled before you choose.

## Development

```bash
npm install
npm run build
```

| Command | What it does |
|---|---|
| `npm run build` | generates `dist/pokerogue-tier-overlay.user.js` |
| `npm run build:tiers` | regenerates the tier table from `@pkmn/dex` |
| `npm run build:biomes` | regenerates encounter pools from the PokéRogue repository |
| `npm run build:movesets` | regenerates moves from Smogon sets |
| `npm run build:bookmarklet` | generates `dist/bookmarklet.txt` |
| `npm test` | tests (Vitest) |
| `npm run typecheck` | TypeScript in strict mode |
| `npm run lint` | Biome |
| `npm run launch` | opens the game in a Chrome with the bundle injected |
| `npm run launch -- --late` | the same, injecting **after** the game loads |

## How it works, and why this way

PokéRogue is a Phaser game drawn on canvas: there is no DOM to read. It also doesn't expose the
`Phaser.Game` instance in any global. Three decisions follow from that, and none is obvious
from the code alone:

**Capturing the game has two strategies, and that is not redundancy.** The first intercepts the
assignment to `window.Phaser` and depends on running before the game's bundle. Except
Tampermonkey's `@run-at document-start`
[is not deterministic](https://github.com/Tampermonkey/tampermonkey/issues/211): sometimes the
script arrives late. The second strategy covers that case, capturing the game mid-flight on the
first frame of any scene. Without it, the overlay would fail intermittently and be hard to
reproduce.

**Badges are Phaser objects, not HTML elements.** The starter grid has 572 icons. An HTML
overlay would have to convert canvas coordinates, react to scroll, to filters and to resizing,
and keep hundreds of nodes in sync. Because each badge is a child of the container the game
itself draws, position, scale, scroll and visibility are inherited. The synchronization problem
isn't solved — it stops existing. It's also what makes the overlay work on a phone screen with
no extra code.

**Identification is always by `speciesId`, never by text.** The game's interface is translated;
ability and biome names change with the language. The Pokédex number does not.

Architecture details and what was verified in production are in
[`specs/userscript-v2/design.md`](specs/userscript-v2/design.md).

## If a red warning shows up

`tier overlay: nao capturou o jogo (...)` means neither strategy found the Phaser instance
within 20 seconds — usually because a PokéRogue update changed how the game loads. Open an
issue with the game version.

The overlay fails visibly on purpose. A silent panel showing the wrong tier would be worse than
no panel.

## Known limitations

- Type coverage considers **presence**, not effectiveness: it tells you which types nobody on
  your team has, it does not compute weaknesses or resistances. Damage calculation is another
  story.
- It does not suggest swaps or tell you which Pokémon to release.
- PokéRogue-exclusive forms with no Smogon equivalent fall back to the base species.
- Tier measures strength in Smogon's competitive metagame, which is not the same thing as
  strength in PokéRogue: the game has passives, fusions and items Smogon doesn't model.
- It depends on PokéRogue's internal names, which are not a public API. Today they aren't
  minified; if that changes, the overlay warns instead of lying.
- `npm audit` reports a DoS flaw in `brace-expansion`, a transitive build dependency of
  `vite-plugin-monkey`. It doesn't reach the distributed bundle, and `audit fix` would downgrade
  the plugin to a version incompatible with Vite 8.

## Where the data comes from

Smogon tiers via [`@pkmn/dex`](https://github.com/pkmn/ps), which is MIT.

Per-biome species pools are generated from
[`pagefaultgames/pokerogue`](https://github.com/pagefaultgames/pokerogue), which is
**AGPL-3.0-only**.

The source of truth is the game's code, not the wiki or the forum: where the two disagree, what
actually runs on the player's machine wins.

## Support

The overlay is free and asks for nothing in-game. Anyone who wants to fund maintenance time can
use [GitHub Sponsors](https://github.com/sponsors/OwlHugo).

## License

**AGPL-3.0-only**, because the overlay embeds data derived from the PokéRogue repository, which
is AGPL-3.0-only. Shipping this under MIT would be incompatible with the source's license.

This is a fan project, not affiliated with Nintendo, The Pokémon Company, Smogon or PokéRogue.
