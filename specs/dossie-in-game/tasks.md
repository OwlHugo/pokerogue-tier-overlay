# Tasks — companion in-game

Uma tarefa por commit. TDD onde há lógica; badge, hub e telas são verificados por screenshot
em jogo real. O passo a passo com código está em [`plan.md`](plan.md).

A ordem tem três restrições. **A4 depende de A2 e A3**, porque as tabelas de nome são
filtradas pelo que as outras referenciam. **A10 depende de A9**, porque o hub só abre se a
badge aceitar clique. **A14 vem antes de A15**, porque publicar sem verificação em jogo é o
que a v2 já se recusou a fazer.

O corte de entrega é A1–A11: com ele o companion funciona em batalha e starter. A12 (escolha
de bioma) é incremento, não pré-requisito.

---

## A1 — Resolver das duas fontes upstream

`tools/build-pokerogue-data.mts` com pins em `data/pokerogue-source.json`, script `build:data`,
aliases do PokéRogue mapeados e o stub do `TerrainType`.

**Pronto quando:** o gerador imprime as contagens lidas; duas execuções dão o mesmo resultado
(AD-2); pin inválido aborta com erro explícito (AD-3); a lista de stubs tem no máximo cinco
entradas (AD-6).

---

## A2 — Tabela de egg moves

**Pronto quando:** `npm run build:data` gera `data/egg-moves.generated.ts`, o typecheck passa,
e o teste confirma cardinalidade e chaves numéricas (AD-1, AD-4).

---

## A3 — Índice de biomas e grafo de destinos

`src/domain/biome.ts` (`Encounter`, `encountersIn`, `destinationsFrom`) mais a emissão de
`data/biome-index.generated.ts` e `data/biome-links.generated.ts`.

**Pronto quando:** testes cobrem espécie ausente do bioma, presente em um, e presente em
vários com raridades e horas diferentes (AD-13); destinos de um bioma conhecido e de um bioma
nulo; e os testes de dados confirmam o formato (AD-4).

---

## A4 — Tabelas de nome filtradas

`ABILITY_NAMES`, `MOVE_NAMES`, `BIOME_NAMES` e `TYPE_NAMES` em `data/names.generated.ts`, só
com os ids referenciados.

**Pronto quando:** todo move de A2 e todo bioma de A3 têm nome, nenhum nome órfão sobra
(AD-5), e o teste de dados confirma (AD-4).

---

## A5 — `domain/forms.ts`

`formsOf(formKeys)` filtrando pelos valores do enum `SpeciesFormKey`.

**Pronto quando:** testes provam mega, mega-x/y, primal, gigantamax e eternamax reconhecidos
com rótulo legível; forma regional e forma vazia ignoradas; espécie sem forma especial
devolvendo lista vazia (AD-15).

---

## A6 — `domain/team.ts` e `game/party.ts`

`profileOf(members)` e a leitura do time da cena.

**Pronto quando:** testes cobrem time vazio, time com espécie de tipo único e de tipo duplo, e
espécie repetida não duplicando o conjunto.

---

## A7 — `domain/dossier.ts`

**Pronto quando:** testes provam campo vazio sem texto de preenchimento (AD-11), regra de
fusão (AD-12), bioma nulo omitindo só a raridade (AD-14), e que o módulo não importa Phaser,
`render/` nem valor de `game/` (AD-10).

---

## A8 — `domain/advice.ts`

`biomeAdvice(destino, profile, tabelas)`.

**Pronto quando:** testes cobrem agrupamento por raridade, espécies novas em relação ao time,
tipos ausentes, e time vazio devolvendo o conteúdo sem a parte comparativa e sem lançar
(AD-16).

---

## A9 — Badge clicável

Shim de `phaser.ts` com `setInteractive` e `on('pointerdown')`; `BadgeSpec` ganha `onClick`
opcional.

**Pronto quando:** teste com fake Phaser prova que o clique chama o handler da badge certa,
que badge sem `onClick` não vira interativa, e que a reconciliação não perde o binding.

---

## A10 — `render/hub.ts`

**Pronto quando:** testes provam `size === 0` fechado (AD-17); trocar de aba sem recriar os
objetos das abas (AD-19); abrir para outro dono fechando o anterior (AD-20); e abrir e fechar
vinte vezes sem deixar objeto órfão.

---

## A11 — Batalha e starter

Repasse do clique nas duas surfaces, `tabsFor` de cada uma, e montagem em `bootstrap.ts`.

**Pronto quando:** testes cobrem as abas montadas por surface e que sair da tela fecha o hub
exatamente uma vez (AD-23).

---

## A12 — Escolha de bioma

`src/surfaces/biome-surface.ts`, com uma aba por destino do `biomeLinks`.

**Pronto quando:** testes cobrem bioma com destinos, bioma sem destino no grafo (nenhuma
badge, tela do jogo intacta), e o cruzamento com o time via `biomeAdvice`.

---

## A13 — Workflow de drift

**Pronto quando:** execução manual com pins antigos abre PR com diff não vazio, e o PR roda
typecheck, lint, test e build (AD-24, AD-25).

---

## A14 — Verificação em jogo

**Pronto quando, com screenshot:** hub aberto em batalha simples e dupla sem cobrir HUD nem
diálogo (AD-21); abrir uma badge fechando a outra na dupla (AD-20); hub na starter com a aba
de formas de uma espécie que tem mega; hub na escolha de bioma; hub legível em viewport de
celular (AD-22); e uma espécie sem egg move sem a linha correspondente (AD-11).

Sem screenshot, não está pronto.

---

## A15 — Licença, bundle e publicação

**Pronto quando:** `npm run build` gera arquivo único sem `@require` e sem fetch (AD-7),
abaixo de 500 KB (AD-8), licença trocada nos três lugares (AD-9), e `npm test`,
`npm run typecheck` e `npm run lint` passam (AD-26).

---

## Fora destas tarefas

Publicar no Greasyfork é passo seu — não consigo autenticar na sua conta.
