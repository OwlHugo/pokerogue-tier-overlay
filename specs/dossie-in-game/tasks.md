# Tasks — dossiê in-game

Uma tarefa por commit. TDD onde há lógica; tarefas de render e de tecla são verificadas por
screenshot em jogo real.

A ordem não é negociável em dois pontos: **A6 vem antes de A7** porque a tecla é resultado
de verificação, não de suposição, e A7 depende de saber qual é; e **A9 vem antes de A10**
porque publicar sem verificação em jogo é o que a v2 já se recusou a fazer.

---

## A1 — Resolver da fonte upstream

`tools/build-pokerogue-data.mts` com o pin em `data/pokerogue-source.json`, exposto como
script `build:data` no `package.json`. Baixa os arquivos do commit pinado, mapeia os path
aliases do PokéRogue (`#enums/`, `#data/`) no `tsconfig` do gerador e importa os módulos com
`tsx`. Nenhuma tabela ainda — só a fonte resolvida.

**Pronto quando:** o gerador imprime a contagem de espécies lidas do upstream pinado; rodar
duas vezes dá o mesmo resultado (AD-2); e sem rede, ou com pin inválido, ele falha com erro
explícito em vez de seguir (AD-3).

---

## A2 — Tabelas de nomes e egg moves

Emite `data/ability-names.generated.ts`, `data/move-names.generated.ts` e
`data/egg-moves.generated.ts`. IDs numéricos como chave, nome como valor.

**Pronto quando:** `npm run build:data` gera os três arquivos, `npm run typecheck` passa com
eles, e os testes de dados confirmam cardinalidade mínima e formato de chave (AD-1, AD-4).

---

## A3 — Índice invertido de biomas

`src/domain/biome.ts` (`Encounter`, `encountersOf`) mais a emissão de
`data/biome-index.generated.ts`. A inversão de bioma→espécies para espécie→ocorrências
acontece na geração, não em runtime.

**Pronto quando:** testes cobrem espécie em nenhum bioma (lista vazia, sem erro), em um, e em
vários com raridades e horas do dia diferentes (AD-10); e o teste de dados confirma o formato
(AD-4).

---

## A4 — `domain/dossier.ts`

`dossierFor(facts, tables): Dossier`, puro. Junta tier resolvido, HA, egg moves, biomas e
catch rate.

**Pronto quando:** testes provam campo vazio para dado ausente sem texto de preenchimento
(AD-8), regra de fusão (AD-9), forma regional caindo para a espécie base, e que o módulo não
importa Phaser, `render/` nem `game/` (AD-7).

---

## A5 — `render/panel.ts`

Container Phaser com backdrop e linhas. Sem regra: linha com valor vazio não é desenhada.
`render` / `clear` / `size`, no padrão do `BadgeLayer`.

**Pronto quando:** testes com fake Phaser provam criação, atualização sem recriar, remoção, e
`size === 0` após `clear` (AD-11).

---

## A6 — A tecla, verificada em jogo

`src/game/keys.ts` e `src/game/facts.ts`. Descobre empiricamente, com
`npm run launch`, qual tecla não é consumida pelo jogo em batalha e na grade de starter, e
implementa o repasse do evento quando o painel não deve reagir.

**Pronto quando, com screenshot:** a tecla escolhida está documentada com a evidência de que
está livre nas duas telas, e pressioná-la durante diálogo do jogo não abre o painel e não
engole o comando (AD-12, e o edge case de diálogo).

---

## A7 — Foco e integração

`src/game/focus.ts` (`FocusCycle`), `Surface.focusedTarget` nas duas surfaces, e
`Overlay.tick` chamando `Panel.render` / `Panel.clear`.

**Pronto quando:** testes cobrem o ciclo com 1 e 2 alvos e com alvo removido no meio (AD-13),
o foco pelo cursor na grade (AD-14), e que trocar de tela limpa o painel exatamente uma vez
(AD-17).

---

## A8 — Workflow de drift

`.github/workflows/data-drift.yml`, semanal: roda o gerador contra a HEAD do upstream e abre
PR com tabelas novas e pin atualizado se houver diff.

**Pronto quando:** uma execução manual do workflow com um pin propositalmente antigo abre um
PR com diff não vazio, e esse PR roda typecheck, lint, test e build (AD-18, AD-19).

---

## A9 — Verificação em jogo

**Pronto quando, com screenshot:** painel aberto em batalha simples e em batalha dupla sem
cobrir HUD nem diálogo (AD-15); alternância entre os dois inimigos (AD-13); painel na grade
de starter acompanhando o cursor (AD-14); painel legível em viewport de celular (AD-16); e
uma espécie sem egg move mostrando o painel sem a linha correspondente (AD-8).

Sem screenshot, não está pronto.

---

## A10 — Bundle e publicação

Injeção das tabelas em `src/main.ts`, README com o painel, a tecla e a origem dos dados, e
nova versão publicada.

**Pronto quando:** `npm run build` gera arquivo único sem `@require` e sem fetch (AD-5), o
`.user.js` está abaixo de 500 KB (AD-6), e `npm test`, `npm run typecheck` e `npm run lint`
passam (AD-20).

---

## Fora destas tarefas

Publicar a versão nova no Greasyfork é passo seu — não consigo autenticar na sua conta.
