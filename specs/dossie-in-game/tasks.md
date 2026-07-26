# Tasks — dossiê in-game

Uma tarefa por commit. TDD onde há lógica; tarefas de render e de tecla são verificadas por
screenshot em jogo real.

Ordem com duas restrições não negociáveis: **A4 depende de A2 e A3**, porque as tabelas de
nome são filtradas pelo que as outras tabelas referenciam; e **A10 vem antes de A11**, porque
publicar sem verificação em jogo é o que a v2 já se recusou a fazer.

O passo a passo com código está em [`plan.md`](plan.md).

---

## A1 — Resolver das duas fontes upstream

`tools/build-pokerogue-data.mts` com os pins em `data/pokerogue-source.json`, exposto como
script `build:data`. Busca os dois repositórios nos commits pinados, mapeia os path aliases do
PokéRogue (`#enums/`, `#data/`) e resolve os módulos contaminados por stubs em `tools/stubs/`.
Nenhuma tabela ainda — só as fontes resolvidas.

**Pronto quando:** o gerador imprime a contagem de espécies e de chaves de locale lidas;
rodar duas vezes dá o mesmo resultado (AD-2); pin inválido ou ausência de rede aborta com erro
explícito (AD-3); e a lista de stubs tem no máximo cinco entradas (AD-22).

---

## A2 — Tabela de egg moves

Emite `data/egg-moves.generated.ts` a partir de `balance/moves/egg-moves.ts`, que importa só
enums e resolve direto.

**Pronto quando:** `npm run build:data` gera o arquivo, `npm run typecheck` passa com ele, e o
teste de dados confirma cardinalidade mínima e chaves numéricas (AD-1, AD-4).

---

## A3 — Índice invertido de biomas

`src/domain/biome.ts` (`Encounter`, `encountersIn`) mais a emissão de
`data/biome-index.generated.ts`. A inversão bioma→espécies para espécie→ocorrências acontece
na geração.

**Pronto quando:** testes cobrem espécie ausente do bioma consultado (lista vazia, sem erro),
espécie presente em um bioma, e espécie presente em vários com raridades e horas do dia
diferentes (AD-10); e o teste de dados confirma o formato (AD-4).

---

## A4 — Tabelas de nome filtradas

Emite `data/names.generated.ts` com `ABILITY_NAMES`, `MOVE_NAMES` e `BIOME_NAMES` a partir do
JSON de locales, contendo **apenas** os ids referenciados pelas tabelas de A2 e A3 e pelas
hidden abilities existentes.

**Pronto quando:** todo id de move presente em `egg-moves.generated.ts` tem nome em
`MOVE_NAMES`, todo bioma presente no índice tem nome em `BIOME_NAMES`, nenhum nome órfão sobra
(AD-21), e o teste de dados confirma (AD-4).

---

## A5 — A tecla, verificada em jogo

`src/game/keys.ts` e `src/game/facts.ts`. Descobre empiricamente, com `npm run launch`, qual
tecla o jogo não consome em batalha, e implementa o repasse do evento quando o painel não deve
reagir. `readRuntimeFacts` extrai `catchRate`, `abilityHidden` e o bioma de `arena.biomeType`.

**Pronto quando, com screenshot:** a tecla escolhida está documentada com a evidência de que
está livre em batalha; pressioná-la durante diálogo não abre o painel nem engole o comando; e
`readRuntimeFacts` devolve `biomeId: null` sem lançar quando a arena não expõe o bioma
(AD-12, AD-24).

---

## A6 — `domain/dossier.ts`

`dossierFor(facts, tables): Dossier`, puro. Junta tier resolvido, HA, egg moves, ocorrências
no bioma atual e catch rate.

**Pronto quando:** testes provam campo vazio para dado ausente sem texto de preenchimento
(AD-8), regra de fusão (AD-9), bioma nulo omitindo só a linha de raridade (AD-24), forma
regional caindo para a espécie base, e que o módulo não importa Phaser, `render/` nem `game/`
(AD-7).

---

## A7 — `render/panel.ts`

Container Phaser com backdrop e linhas. Sem regra: linha com valor vazio não é desenhada.
`render` / `clear` / `size`, no padrão do `BadgeLayer`.

**Pronto quando:** testes com fake Phaser provam criação, atualização sem recriar, remoção, e
`size === 0` após `clear` (AD-11).

---

## A8 — Foco e integração na batalha

`src/game/focus.ts` (`FocusCycle`), consumo do painel dentro da `BattleSurface`, e a montagem
em `bootstrap.ts`.

**Pronto quando:** testes cobrem o ciclo com 1 e 2 alvos e com alvo derrotado no meio (AD-13);
sair da batalha limpa o painel exatamente uma vez (AD-17); e a `StarterSurface` e a interface
`Surface` continuam sem alteração, provado por teste (AD-25).

---

## A9 — Workflow de drift

`.github/workflows/data-drift.yml`, semanal: roda o gerador contra a HEAD dos dois upstreams e
abre PR com tabelas e pins atualizados se houver diff.

**Pronto quando:** uma execução manual com pins propositalmente antigos abre um PR com diff não
vazio, e esse PR roda typecheck, lint, test e build (AD-18, AD-19).

---

## A10 — Verificação em jogo

**Pronto quando, com screenshot:** painel aberto em batalha simples e em batalha dupla sem
cobrir HUD nem diálogo (AD-15); alternância entre os dois inimigos (AD-13); painel legível em
viewport de celular (AD-16); espécie sem egg move exibindo o painel sem a linha correspondente
(AD-8); e a tela de starter idêntica à da v2 (AD-25).

Sem screenshot, não está pronto.

---

## A11 — Licença, bundle e publicação

`LICENSE` para AGPL-3.0-only, campo `license` do userscript acompanhando, README com o painel,
a tecla, a origem dos dados e o crédito aos dois repositórios AGPL, e injeção das tabelas em
`src/main.ts`.

**Pronto quando:** `npm run build` gera arquivo único sem `@require` e sem fetch (AD-5), o
`.user.js` está abaixo de 500 KB (AD-6), a licença está trocada nos três lugares (AD-23), e
`npm test`, `npm run typecheck` e `npm run lint` passam (AD-20).

---

## Fora destas tarefas

Publicar a versão nova no Greasyfork é passo seu — não consigo autenticar na sua conta.
