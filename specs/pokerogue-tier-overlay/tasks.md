# Tasks — PokéRogue Tier Overlay

Uma tarefa por commit. Ordem obrigatória: a tarefa N assume a N-1 concluída.

---

## T1 — Esqueleto do projeto

Criar `package.json` (`type: module`, scripts `build:tiers`, `test`, `start`), `.gitignore`
(`node_modules/`, `.profile/`), instalar `@pkmn/dex` e `puppeteer`.

**Pronto quando:** `npm test` roda e reporta 0 testes sem erro de configuração.

---

## T2 — `src/tier-rank.mjs`

Ranking canônico e comparador, conforme design.md.

**Pronto quando:** `npm test` passa com testes cobrindo: `betterTier('OU','UU') === 'OU'`;
tier desconhecido nunca vence; `betterTier(null, 'NU') === 'NU'`; sufixo de banlist
normalizado (`'(OU)'` trata como `'OU'`).

---

## T3 — `src/evo-line.mjs`

Subida por `prevo`, descida recursiva por `evos`, redução com `betterTier`.

**Pronto quando:** `test/evo-line.test.mjs` passa — CA-4 (Magikarp, relacional), CA-5
(Ditto), e o caso ramificado do Eevee.

---

## T4 — `scripts/build-tiers.mjs` + `data/tiers.json`

Gera o JSON com chaves `<dex>` e `<dex>:<formKey>`.

**Pronto quando:** `npm run build:tiers` sai com código 0 e `test/tiers-data.test.mjs`
passa — CA-1, CA-2, CA-3, CA-6. JSON commitado.

---

## T5 — `src/overlay.js`: leitura de estado

Só as partes puras: `extractEnemies` e `resolve`, expostas em `globalThis.__tierOverlay`.
Sem hook, sem render ainda.

**Pronto quando:** `test/overlay.test.mjs` passa — CA-8, CA-9, CA-10, usando a scene falsa
no shape capturado em produção.

---

## T6 — `src/overlay.js`: hook do Phaser

Setter em `window.Phaser` + patch de `Game.prototype.boot`. Timeout de 15s com aviso
vermelho.

**Pronto quando:** código escrito e revisado. Verificação real fica na T8 — não afirmar que
funciona antes disso.

---

## T7 — `src/overlay.js`: render

Painel ancorado ao canvas, cores por tier, re-render só na mudança, oculto sem batalha.

**Pronto quando:** código escrito. Verificação visual na T8.

---

## T8 — `src/launch.mjs` e verificação de ponta a ponta

Launcher Puppeteer com `userDataDir` persistente e injeção via `evaluateOnNewDocument`.

**Pronto quando, com evidência (screenshot em batalha ativa):** CA-11, CA-12, CA-13, CA-14,
CA-16. Sem screenshot, a tarefa não está pronta.

---

## T9 — README

Como rodar, como atualizar tiers, o que fazer se aparecer o aviso vermelho.

**Pronto quando:** `npm start` funciona seguindo só o README, do zero.
