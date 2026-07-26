# Tasks — v2: userscript publicável

Uma tarefa por commit. TDD onde há lógica; tarefas de configuração e de render são
verificadas por build e por screenshot.

---

## V1 — Toolchain

TypeScript strict, Vite + `vite-plugin-monkey`, Vitest, Biome. Scripts `build`, `dev`,
`test`, `typecheck`, `lint`.

**Pronto quando:** `npm run typecheck`, `npm run lint` e `npm test` rodam sem erro (0
testes é aceitável aqui), e `npm run build` gera um `.user.js` com bloco de metadados
(CA-1, CA-3, CA-4).

---

## V2 — `domain/`

`tier.ts`, `species-key.ts`, `tier-table.ts`. Porta a lógica da v1 para TypeScript com
`Tier` como união literal.

**Pronto quando:** testes cobrem ordenação, `bestOf` com `null` e desconhecido, chave com e
sem forma, e resolução de fusão.

---

## V3 — `tools/build-tier-table.mts` e tabela gerada

Emite `data/tier-table.generated.ts` tipado, ainda excluindo CAP (`num < 1`).

**Pronto quando:** `npm run build:tiers` gera o arquivo, `npm run typecheck` continua
passando com ele, e o teste de dados confirma ≥1000 entradas e o formato das chaves.

---

## V4 — `render/badge-layer.ts`

`BadgeLayer.reconcile` / `clear` / `size`, com fakes de Phaser.

**Pronto quando:** testes provam criação, atualização, remoção e `size === 0` após `clear`
(CA-19).

---

## V5 — `game/` leitura de estado

`readBattleTargets`, `readStarterTargets`, `activeHandlerName`.

**Pronto quando:** testes cobrem `currentBattle: null`, batalha dupla, fusão, e grade de
starter com containers invisíveis filtrados (CA-13, CA-14).

---

## V6 — `game/capture.ts` e estratégias

As duas estratégias e o diagnóstico de falha.

**Pronto quando:** teste unitário prova que `captureGame` resolve pela estratégia 2 quando
`window.Phaser` já existe. Verificação real na V9 (CA-7, CA-8, CA-9).

---

## V7 — `Overlay` e as duas surfaces

`Surface`, `BattleSurface`, `StarterSurface`, `Overlay.tick`.

**Pronto quando:** teste com surfaces falsas prova que só a que dá match sincroniza e que
`clear` é chamado exatamente uma vez ao sair da tela (CA-17, CA-18).

---

## V8 — `main.ts` e bundle

Entry do userscript, metadados, tabela embutida.

**Pronto quando:** `npm run build` gera arquivo único sem `@require` e sem fetch (CA-2).

---

## V9 — Verificação em jogo real

`tools/dev-launch.mts`. Screenshots obrigatórias: badge sobre sprite em batalha, marcações
na grade de starter, e captura pela estratégia 2.

**Pronto quando, com screenshot:** CA-7, CA-8, CA-10, CA-11, CA-12, CA-14, CA-15, CA-16.
Sem screenshot, não está pronto.

---

## V10 — Publicação

README com GIF de demonstração, `LICENSE` (MIT), CI no GitHub Actions, e as instruções de
publicação no Greasyfork.

**Pronto quando:** CI verde no push (CA-5, CA-6) e README permite instalar e usar sem
contexto desta conversa.

---

## Fora destas tarefas

Instalar no Tampermonkey real e publicar no Greasyfork são passos seus — eu não consigo
instalar a extensão nem autenticar na sua conta.
