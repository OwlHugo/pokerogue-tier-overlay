# Design — PokéRogue Tier Overlay

## Reconhecimento feito em produção

Este design não é especulativo. Os fatos abaixo foram verificados ao vivo em
`https://pokerogue.net/` com uma batalha ativa (Hoothoot vs Bulbasaur), em 2026-07-26.

| Fato | Valor observado |
|---|---|
| Engine | Phaser `3.90.0`, exposto em `window.Phaser` |
| Plugins | `window.RexPlugins` presente |
| Globais extras | apenas `Phaser`, `RexPlugins`, `gameInfo` |
| Instância do `Phaser.Game` | **não exposta em nenhum global** → hook obrigatório |
| `window.gameInfo` | objeto vivo `{gameInfoVersion, playTime, gameMode, biome, wave, luck, party}` — `party` é **só o time do jogador**, inútil aqui |
| Scene de batalha | chave `"battle"`, acessível por `game.scene.getScene('battle')` |
| Métodos/campos | `getEnemyField()`, `getEnemyParty()`, `currentBattle`, `party`, `arena` — **nomes não minificados** |
| `currentBattle` | `null` na tela de título; em batalha traz `enemyParty`, `waveIndex`, `battleType`, `double` |
| Pokémon inimigo | `{ species: {speciesId, name, forms, ...}, formIndex, level, fusionSpecies, fusionFormIndex, shiny, isBoss() }` |
| `species.speciesId` | número da Pokédex nacional (Hoothoot = 163) |
| Idioma da UI | traduzida (PT-BR observado) — nomes de habilidade/bioma vêm traduzidos |

Consequências de projeto que saem direto daí:

1. Identificação por `speciesId`, nunca por string exibida — a UI é traduzível.
2. Não existe atalho global para o `Game`; o hook precisa rodar **antes** do bundle da
   página. É exatamente o que `page.evaluateOnNewDocument` do Puppeteer dá — e é o motivo
   de o launcher Puppeteer ser a escolha certa aqui, não um detalhe de conveniência.
3. Como os nomes de método são preservados no build, a leitura de estado é direta e legível,
   sem duck-typing frágil.

## Arquitetura

```
pokerogue-tier-overlay/
├─ package.json
├─ .gitignore                 # node_modules/, .profile/
├─ data/tiers.json            # gerado, commitado
├─ scripts/build-tiers.mjs    # @pkmn/dex → data/tiers.json
├─ src/
│  ├─ tier-rank.mjs           # ordem canônica de tiers + comparador  (puro, node)
│  ├─ evo-line.mjs            # linha evolutiva → melhor tier         (puro, node)
│  ├─ overlay.js              # injetado na página (sem imports)
│  └─ launch.mjs              # Puppeteer launcher
├─ test/
│  ├─ evo-line.test.mjs
│  ├─ tiers-data.test.mjs
│  └─ overlay.test.mjs
└─ specs/
```

### Fluxo

```
npm run build:tiers   (offline, manual)
   @pkmn/dex Gen 9 ──► evo-line.mjs ──► data/tiers.json

npm start             (runtime)
   launch.mjs
     ├─ lê data/tiers.json e src/overlay.js
     ├─ puppeteer.launch({ headless:false, userDataDir:'.profile' })
     ├─ page.evaluateOnNewDocument( "window.__tierData=<json>;" + overlay.js )
     └─ page.goto('https://pokerogue.net/')
          │
          └─ overlay.js na página:
               hook Phaser ──► captura game ──► loop 400ms
                  ──► scene.getEnemyField() ──► lookup em __tierData ──► render painel
```

## Componentes

### `src/tier-rank.mjs`

Ordem canônica, do melhor para o pior:

```
AG, Uber, OU, UUBL, UU, RUBL, RU, NUBL, NU, PUBL, PU, ZUBL, ZU, NFE, LC
```

Exporta `RANK` (mapa tier → índice) e `betterTier(a, b)`. Tiers ausentes do mapa
(`Illegal`, `Unreleased`, `undefined`) são tratados como ausentes: nunca vencem uma
comparação e nunca viram `bestTier`. Sufixos de banlist do dex (`(OU)`, `(UU)`) são
normalizados removendo parênteses antes do lookup.

### `src/evo-line.mjs`

Puro, sem I/O. Recebe o dex e uma espécie; devolve a linha evolutiva completa e o melhor
tier dela.

- Sobe por `prevo` até a raiz.
- Desce recursivamente por `evos`, cobrindo ramificações (Eevee, Ralts, Wurmple).
- Reduz a linha com `betterTier`.

Retorno: `{ line: string[], bestTier: string|null, bestName: string|null }`.

### `scripts/build-tiers.mjs`

Percorre `Dex.forGen(9).species.all()` e emite:

```json
{
  "129":      { "tier":"LC", "bestTier":"UU", "bestName":"Gyarados",
                "line":["Magikarp","Gyarados"] },
  "26:alola": { "tier":"NU", "bestTier":"NU", "bestName":"Raichu-Alola",
                "line":["Pichu","Pikachu","Raichu-Alola"] }
}
```

**Chave:** `String(species.num)` para a forma base; `` `${num}:${formKey}` `` para formas
regionais, onde `formKey` ∈ `alola | galar | hisui | paldea`, derivado do sufixo do nome no
dex (`-Alola` → `alola`). Esse é o mesmo vocabulário que o PokéRogue usa em
`species.forms[formIndex].formKey`, então o lookup em runtime casa sem tabela de tradução.

Espécies com `tier` ausente ou `Illegal` entram no JSON com `tier: null` — a entrada existe
(para não confundir "desconhecido" com "não catalogado"), mas não contribui para `bestTier`.

Gen 9 é a geração mais recente coberta pelo `@pkmn/dex`; o comando é re-rodável quando o
pacote for atualizado. Sem rede em runtime.

### `src/overlay.js`

Arquivo único, **sem `import`/`export`** — é injetado como texto na página, antes de
qualquer script do jogo. Expõe tudo em `globalThis.__tierOverlay` para permitir teste em
Node via `new Function(code)` (ver Testes). Sem bundler, sem build step.

Responsabilidades, em ordem:

**1. Hook.** No momento da injeção `window.Phaser` ainda não existe. Instala um setter que
dispara quando o bundle do jogo define o namespace, e daí patcheia o `boot` do `Game`:

```js
let _P;
Object.defineProperty(window, 'Phaser', {
  configurable: true,
  get: () => _P,
  set(v) {
    _P = v;
    const boot = v.Game.prototype.boot;
    v.Game.prototype.boot = function () {
      window.__tierGame = this;
      return boot.apply(this, arguments);
    };
  },
});
```

(Validado por caminho equivalente em runtime: patchear `Phaser.Scenes.Systems.prototype.step`
capturou a instância e `instanceof Phaser.Game` deu `true`.)

**2. `extractEnemies(scene)`** — puro, testável. Retorna `[]` se `scene` ou
`scene.currentBattle` for falsy. Caso contrário mapeia `scene.getEnemyField()` para
`{ speciesId, formIndex, name, fusion: { speciesId, formIndex } | null }`.

**3. `resolve(mon, data)`** — puro. Monta a chave (`<id>` ou `<id>:<formKey>`, caindo para
`<id>` quando a chave com forma não existe), busca em `__tierData`, e no caso de fusão
compara as duas entradas com `betterTier` (uma cópia mínima do ranking vive dentro do
`overlay.js`, já que ele não pode importar). Sem entrada → `{ tier:'?', bestTier:'?' }`.

**4. Loop.** `setInterval` de 400ms. Serializa os ids do campo numa string; só re-renderiza
quando essa string muda. Se `window.__tierGame` continuar indefinido após 15s, renderiza o
aviso vermelho de falha (CA-15) e para o loop.

**5. Render.** Um `<div>` fixo, `pointer-events:none`, `z-index` alto, ancorado ao
`getBoundingClientRect()` do canvas: alinhado à direita, deslocado ~12% da altura do canvas
a partir do topo — a faixa de céu logo abaixo do texto de bioma/dinheiro, verificada vazia
na captura de tela. Reposiciona em `resize`. Uma linha por inimigo:

```
Hoothoot · NU → OU (Noctowl)
```

Cor de fundo por `bestTier`: AG/Uber roxo, OU vermelho, UU/RU âmbar, resto cinza, `?`
cinza-escuro. Painel oculto quando não há inimigos (CA-14).

### `src/launch.mjs`

```js
puppeteer.launch({
  headless: false,
  userDataDir: '.profile',          // login persiste entre sessões (CA-12)
  defaultViewport: null,
  args: ['--window-size=1280,900'],
});
```

Lê `data/tiers.json` e `src/overlay.js` do disco, concatena
`window.__tierData = <json>;\n` + código, injeta com `page.evaluateOnNewDocument(script)`,
e navega. `.profile/` no `.gitignore` — contém sessão autenticada, não vai para o git.

## Contratos

```js
// tier-rank.mjs
RANK: Record<string, number>
betterTier(a: string|null, b: string|null): string|null

// evo-line.mjs
evoLine(dex, species): { line: string[], bestTier: string|null, bestName: string|null }

// data/tiers.json
Record<string, { tier: string|null, bestTier: string|null,
                 bestName: string|null, line: string[] }>

// overlay.js → globalThis.__tierOverlay
extractEnemies(scene): Array<{ speciesId, formIndex, name, fusion }>
resolve(mon, data): { name, tier, bestTier, bestName }
```

## Testes

`node --test`, sem runner externo.

- `evo-line.test.mjs` — usa o `@pkmn/dex` real. Asserções **relacionais**, não literais:
  `bestTier(Magikarp) === tier(Gyarados)` e é melhor que `tier(Magikarp)`. Tier literal
  muda a cada shift do Smogon; o teste não pode quebrar por isso. Cobre ramificação (Eevee:
  linha contém todas as evoluções) e espécie sem evolução (Ditto).
- `tiers-data.test.mjs` — valida o JSON gerado: contagem, formato das chaves, presença dos
  campos (CA-2, CA-3, CA-6).
- `overlay.test.mjs` — carrega `src/overlay.js` com `new Function`, num `globalThis`
  preparado com `window` falso, e exercita `extractEnemies` / `resolve` contra uma scene
  falsa modelada **no shape real capturado em produção** (incluindo o caso
  `currentBattle: null` e o caso com `fusionSpecies`).

O hook do Phaser não é testável em Node — depende do bundle real. É verificado
manualmente com screenshot em batalha ativa, e é justamente o que CA-15 protege.

## Riscos

| Risco | Mitigação |
|---|---|
| PokéRogue renomeia `getEnemyField`/`currentBattle` | CA-15: aviso vermelho visível; correção é de uma linha |
| Bundle passa a não expor `window.Phaser` | Hook falha → CA-15 dispara. Plano B verificado: patch em `Phaser.Scenes.Systems.prototype.step` |
| Formas exclusivas do PokéRogue sem par no Smogon | Cai para a entrada base; se nem isso, mostra `?` |
| Tiers do Smogon mudam | `npm run build:tiers` regenera; testes são relacionais e não quebram |
