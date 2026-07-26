# Requirements — companion in-game

Sucessora da spec `userscript-v2/`. A v2 entrega uma badge com o melhor tier da linha
evolutiva. Esta spec transforma o overlay em **companion**: uma badge discreta que, ao ser
clicada, abre um hub com tudo que a decisão daquele momento precisa.

Critérios usam o prefixo `AD-`. Referências a `CA-` apontam para
`userscript-v2/requirements.md`.

## Objetivo

Responder, no momento de cada decisão irreversível da run, o que hoje exige sair do jogo:
o que vale capturar, o que aquele Pokémon vira, quais formas ele alcança, e **para onde ir
em seguida**.

## Padrão de interação, e por que ele é o requisito mais importante

O overlay **não despeja dado na tela**. A v2 já acertou ao usar uma badge mínima; esta spec
mantém isso e adiciona profundidade atrás de um clique.

- Estado fechado: a badge que a v2 já desenha, com o tier. Nada mais.
- Um clique na badge abre o **hub**: painel com abas, ancorado no container do jogo.
- Um clique fora, ou na mesma badge, fecha.

Uma superfície de interação, reusada em todas as telas. Isso é o que impede a feature de
virar HUD paralela — e é o que faz o slice B (busca) nascer sem UI nova.

## Superfícies

| Tela | Badge fechada | Hub aberto |
|---|---|---|
| Batalha | tier da linha (v2) | dossiê do inimigo: HA, egg moves, raridade aqui, catch rate, formas |
| Seleção de starter | tier da linha (v2) | mesmas abas, mais as formas especiais que a espécie alcança |
| Escolha de bioma | resumo por destino | o que cada bioma oferece, cruzado com o time atual |

## Decisões, e de onde saíram

Cada uma foi verificada no jogo rodando ou no código-fonte do PokéRogue, não suposta.

**A fonte da verdade é o repositório do jogo, não wiki nem fórum.** Dado de comunidade
envelhece e diverge entre páginas; o código é o que efetivamente roda na máquina do jogador.
Onde os dois divergirem, o código vence, e o overlay não tenta reconciliar.

**Mega, Gigantamax, Primal e Eternamax são legíveis em runtime.** Estão em
`species.forms[].formKey`, com os valores do enum `SpeciesFormKey` do upstream (`mega`,
`mega-x`, `mega-y`, `primal`, `gigantamax`, `eternamax`, entre outros). Não precisam de
tabela gerada, e acompanham a versão que o jogador roda.

**A escolha de bioma é um grafo que já existe no upstream.** Cada bioma exporta
`biomeLinks: readonly (BiomeId | readonly [BiomeId, number])[]` — "os biomas para onde se
pode viajar a partir daqui". Plains leva a Grass, Metropolis e Lake. É exatamente a tela de
escolha, e sai da mesma geração que o índice de espécies.

**O time do jogador entra como contexto, não como dado exibido.** Ele serve para responder
"o que este bioma me oferece que eu ainda não tenho" — cobertura de tipos e espécies novas.
Sem isso, listar 40 espécies por bioma é ruído.

**O painel é factual.** Veredito de captura e nature recomendada continuam fora: são opinião,
e opinião errada derruba a confiança nos fatos acima dela.

**Egg moves aparecem, mesmo travados no save.** O jogo os esconde como `???` até o
desbloqueio. Revelar contorna progressão deliberada dos desenvolvedores; foi levantado e
decidido conscientemente. Fica registrado para ser rastreável, não redebatido.

**Runtime é a fonte quando alcança; tabela gerada só para o resto.** Minimiza a superfície
que envelhece quando o PokéRogue atualiza.

## O que o runtime entrega, verificado em jogo

Lido ao vivo em `pokerogue.net`, capturando o jogo pela mesma estratégia da v2:

| Campo | Observado |
|---|---|
| `abilityHidden` | `140` (Ralts) |
| `catchRate` | `235` |
| `type1`, `type2` | `13`, `17` |
| `baseStats` | `[28,25,25,45,35,40]` |
| `getEvolutionLevels()` | `[[281,20],[282,30],[475,1]]` |
| `species.forms[].formKey` | chaves do enum `SpeciesFormKey` |
| `StarterSelectUiHandler.allSpecies` | 572 espécies |
| `scene.arena.biomeType` | id numérico do bioma atual |

`window.i18next` **não** existe: nome de ability, move e bioma só sai de tabela gerada.
`window.gameInfo` existe e expõe bioma, wave e party, mas como strings de exibição sob um
`gameInfoVersion` próprio — contrato mais frágil que os objetos da cena, e por isso não é a
fonte.

## Origem de cada dado

| Dado | Fonte |
|---|---|
| `catchRate`, `abilityHidden`, tipos, base stats, `forms[].formKey` | runtime, via `species` |
| bioma atual | runtime, via `scene.arena.biomeType` |
| time do jogador | runtime, via a party da cena |
| egg moves por espécie | gerada de `pokerogue` |
| raridade por bioma e hora do dia | gerada de `pokerogue` |
| grafo de destinos entre biomas | gerada de `pokerogue` |
| nome de ability, move e bioma | gerada de `pokerogue-locales` |
| tier Smogon da linha | gerada de `@pkmn/dex` (já existente) |

## Licença

`pagefaultgames/pokerogue` e `pagefaultgames/pokerogue-locales` são **AGPL-3.0-only**. Esta
spec embute dados derivados deles no bundle distribuído, o que a v2 não fazia.

Se a extração constitui obra derivada é ponto contestado: fato isolado não tem copyright, mas
a compilação (a seleção e o arranjo das pools de bioma e da lista de egg moves) tem proteção
em várias jurisdições, e o gerador copia a compilação quase inteira. Em vez de apostar numa
interpretação, o projeto adota AGPL-3.0-only e a questão deixa de existir.

## User stories

1. Como jogador em batalha, clico na badge do inimigo e vejo se vale a Pokébola, sem trocar
   de aba.
2. Como jogador escolhendo starter, vejo quais formas especiais aquela espécie alcança antes
   de gastar um slot.
3. Como jogador na escolha de bioma, vejo o que cada destino oferece **em relação ao time que
   eu tenho**, e não uma lista crua.
4. Como jogador, nada aparece na tela até eu pedir: fechado, o overlay é a badge da v2.
5. Como jogador, se o overlay não sabe algo, ele **omite** — nunca preenche com palpite.
6. Como mantenedor, quando o PokéRogue atualiza os dados, recebo um PR com a tabela nova.

## Critérios de aceite

### Geração de dados

- AD-1: `npm run build:data` gera `data/egg-moves.generated.ts`,
  `data/biome-index.generated.ts`, `data/biome-links.generated.ts` e `data/names.generated.ts`,
  todos tipados, com `npm run typecheck` passando.
- AD-2: O gerador lê de commits **pinados** dos dois upstreams, em
  `data/pokerogue-source.json`. Duas execuções sem mudar os pins produzem arquivos idênticos.
- AD-3: Falha ao resolver uma fonte **aborta** o gerador com erro explícito. Sem tabela
  parcial, sem reaproveitar a anterior.
- AD-4: Testes confirmam, por tabela, cardinalidade mínima e formato de chave, no padrão de
  `test/tier-table-data.test.ts`.
- AD-5: As tabelas de nome são filtradas: só entram nomes referenciados pelas outras tabelas.
- AD-6: Módulos upstream que arrastam `i18next` ou Phaser por transitividade são resolvidos
  por stubs locais num único lugar. Passando de cinco, o gerador troca importação por AST.

### Empacotamento e licença

- AD-7: Bundle único e autocontido, sem `@require` e sem fetch em runtime (mantém CA-2).
- AD-8: O `.user.js` permanece abaixo de 500 KB. O build é `minify: false`, então a medida é
  do arquivo como distribuído.
- AD-9: `LICENSE` passa a AGPL-3.0-only, o campo `license` do userscript acompanha, e o
  README credita os dois repositórios upstream com a licença deles.

### Domínio

- AD-10: `src/domain/` não importa nada de `render/`, `game/` ou Phaser, exceto `type`.
- AD-11: Dado ausente produz campo vazio e **linha não renderizada**. Não existe texto de
  preenchimento. A ausência de tier Smogon continua exibindo `?`, como na v2.
- AD-12: Pokémon fundido mostra os dois nomes, resolve o tier entre as duas linhas como a v2
  faz, e exibe os fatos da espécie primária.
- AD-13: Dado bioma e espécie, o índice devolve raridade e hora do dia, ou nada. Espécie
  ausente daquele bioma não produz linha, e isso não é erro.
- AD-14: Bioma ilegível omite só a linha de raridade; o resto do hub continua.
- AD-15: `formsOf(species)` devolve apenas as formas especiais reconhecidas pelo enum
  `SpeciesFormKey`, com o rótulo legível. Espécie sem forma especial devolve lista vazia.
- AD-16: `biomeAdvice(destino, time, tabelas)` devolve, para um bioma de destino: as espécies
  capturáveis por raridade, quais delas são novas para o time, e quais tipos o time ainda não
  cobre. Time vazio devolve o mesmo conteúdo sem a parte comparativa, sem lançar.

### Hub e badge

- AD-17: Com o hub fechado, nenhum objeto do hub existe na cena — `size === 0`, no padrão de
  CA-19. As badges da v2 continuam sendo o único desenho.
- AD-18: Clique na badge abre o hub; clique na mesma badge ou fora dele fecha. Nenhuma tecla
  nova é registrada, e o overlay não consome input que o jogo esperava.
- AD-19: O hub tem abas, e trocar de aba não recria os objetos das outras.
- AD-20: Em batalha dupla, cada inimigo tem a própria badge, e abrir uma fecha a outra.
- AD-21: O hub aberto não cobre a HUD de batalha nem o texto de diálogo (estende CA-15,
  CA-16).
- AD-22: O hub é legível em viewport de celular sem código de layout específico — herda escala
  do container do jogo, como as badges já fazem.
- AD-23: Sair da tela com o hub aberto limpa o hub exatamente uma vez, no padrão de CA-18.

### Manutenção

- AD-24: Workflow semanal roda o gerador contra a HEAD dos dois upstreams e abre PR se as
  tabelas mudarem.
- AD-25: O PR passa por typecheck, lint, test e build antes de ser mergeável (reusa CA-6).
- AD-26: `npm test`, `npm run typecheck` e `npm run lint` passam.

## Edge cases

| Caso | Comportamento |
|---|---|
| Espécie sem hidden ability, sem egg move, ou fora do bioma | linha ausente, sem preenchimento |
| Bioma atual ilegível | só a linha de raridade some (AD-14) |
| Pokémon fundido | dois nomes, tier entre as linhas, fatos da primária (AD-12) |
| Forma regional | chave espécie+forma resolve; sem entrada, cai para a espécie base |
| Espécie sem forma especial | aba de formas vazia, e a aba não é oferecida (AD-15) |
| Time vazio na escolha de bioma | conteúdo do bioma sem comparação (AD-16) |
| Bioma de destino sem link no grafo | nenhuma badge de destino; a tela do jogo segue intacta |
| Espécie nova, ausente da tabela gerada | campos gerados somem; os de runtime permanecem |
| Clique na badge durante diálogo do jogo | hub não abre e o clique segue para o jogo |

## Fora de escopo

- Veredito de captura, nature recomendada, IVs, builds, sinergias — opinião, não fato.
- Calculadora de dano e de catch: slice C, depende deste domínio.
- Busca por atalho (Ctrl+K): slice B, reusa o hub sem UI nova.
- Backend, conta de usuário, sincronização de runs: slice E.
