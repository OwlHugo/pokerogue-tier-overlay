# Requirements — dossiê in-game

Sucessora da spec `userscript-v2/`. A v2 entrega uma badge com o melhor tier da linha
evolutiva. Esta spec entrega o **dossiê**: o resto do que o jogador precisa saber para
decidir, sem sair do jogo.

Critérios desta spec usam o prefixo `AD-`. Referências a `CA-` apontam para
`userscript-v2/requirements.md`.

## Objetivo

Responder, dentro do jogo e no momento da decisão, o que hoje exige abrir a wiki em outra
aba: qual é a hidden ability, quais são os egg moves, em que biomas a espécie aparece e com
que raridade, e qual a catch rate.

## Escopo

Este é o slice A de uma decomposição maior. Fora desta spec, e cada um com spec própria:
busca instantânea in-game (Ctrl+K), calculadoras de catch e dano, site/wiki, API pública,
login e sincronização de runs.

## Decisões que moldam tudo abaixo

**A badge continua mínima.** O dossiê não cabe acima de um sprite em batalha dupla sem
violar CA-15 e CA-16. Ele vive num painel que só existe quando o jogador pede.

**O painel é factual.** Todo campo é fato verificável extraído do jogo ou do Smogon.
Veredito de captura e nature recomendada são opinião e ficam fora — quando uma opinião
erra, ela derruba a confiança nos fatos que estão acima dela.

**Runtime é a fonte quando alcança; tabela gerada só para o que ele não alcança.** Isso
minimiza a superfície que pode envelhecer quando o PokéRogue atualiza.

## Origem de cada dado

| Dado | Fonte | Por quê |
|---|---|---|
| `catchRate`, `abilityHidden` (id) | runtime, via `pokemon.species` | já alcançado pelo overlay; acompanha a versão que o jogador roda, e reflete fusão e forma |
| egg moves por espécie | gerada de `pokerogue` | `src/data/balance/moves/egg-moves.ts`; não existe no objeto do Pokémon |
| bioma, raridade, hora do dia | gerada de `pokerogue` | `src/data/balance/biomes/*.ts`; idem |
| nome de ability, move e bioma | gerada de `pokerogue-locales` | os nomes não estão em `src/data`: `allAbilities` e `allMoves` são module-scope em `src/data/data-lists.ts`, e o texto vive no repositório de locales como JSON |
| tier Smogon da linha | gerada de `@pkmn/dex` | já é assim na v2 |

São **duas** fontes upstream pinadas, `pagefaultgames/pokerogue` e
`pagefaultgames/pokerogue-locales`, mais o `@pkmn/dex` que já era dependência.

## Licença

Ambos os repositórios upstream são **AGPL-3.0-only**. Esta spec passa a embutir dados
derivados deles no bundle distribuído, o que a v2 não fazia — o `@pkmn/dex` é MIT.

Se a extração desses dados constitui obra derivada é ponto genuinamente contestado: fato
isolado não tem copyright, mas a compilação (a seleção e o arranjo das pools de bioma e da
lista de egg moves) tem proteção em várias jurisdições, e o gerador copia a compilação quase
inteira. Em vez de apostar numa interpretação, o projeto adota AGPL-3.0-only e a questão
deixa de existir. É coerente com ser companion de um jogo AGPL, e o Greasyfork aceita.

## User stories

1. Como jogador em batalha, aperto uma tecla e vejo o dossiê do inimigo à minha frente, sem
   trocar de aba.
2. Como jogador em batalha dupla, alterno o dossiê entre os dois inimigos com a mesma tecla.
3. Como jogador escolhendo starter, vejo o dossiê da espécie sob o cursor da grade.
4. Como jogador, o painel não me atrapalha: fechado ele não ocupa pixel nenhum, aberto não
   cobre a HUD, e a tecla nunca rouba um comando do jogo.
5. Como jogador, se o overlay não sabe algo, ele **omite** — nunca preenche com palpite.
6. Como mantenedor, quando o PokéRogue atualiza os dados, eu recebo um PR com a tabela nova
   em vez de descobrir pelo relato de um usuário.

## Critérios de aceite

### Geração de dados

- AD-1: `npm run build:data` gera `data/names.generated.ts`, `data/egg-moves.generated.ts` e
  `data/biome-index.generated.ts`, todos tipados, e `npm run typecheck` continua passando.
- AD-2: O gerador lê de commits **pinados** dos dois repositórios upstream, registrados em
  `data/pokerogue-source.json`. Rodar o gerador duas vezes sem mudar os pins produz arquivos
  byte a byte idênticos.
- AD-3: Se o gerador não conseguir resolver uma fonte upstream, ele **falha** com erro
  explícito. Não emite tabela parcial e não reaproveita a tabela anterior.
- AD-4: Testes de dados confirmam, para cada tabela gerada, cardinalidade mínima e formato
  das chaves, no padrão de `test/tier-table-data.test.ts`.
- AD-21: As tabelas de nome são **filtradas**: só entram nomes efetivamente referenciados
  pelas outras tabelas ou pelo runtime — hidden abilities, moves que são egg move, e biomas.
  Copiar `move.json` inteiro (179 KB) para usar uma fração é desperdício de bundle.
- AD-22: Módulos upstream que arrastam `i18next` ou Phaser por transitividade são resolvidos
  por stubs locais declarados explicitamente em um único lugar. Se a lista de stubs passar de
  cinco entradas, o gerador troca importação por leitura de AST — o limite existe para a
  gambiarra não crescer sem alguém decidir.

### Empacotamento

- AD-5: O bundle continua único e autocontido, sem `@require` e sem fetch em runtime
  (mantém CA-2).
- AD-6: O `.user.js` gerado permanece abaixo de 500 KB. O build é `minify: false`, então a
  medida é do arquivo como distribuído, sem contar com compressão.
- AD-23: `LICENSE` passa a ser AGPL-3.0-only, o campo `license` do bloco de metadados do
  userscript acompanha, e o README credita `pagefaultgames/pokerogue` e
  `pagefaultgames/pokerogue-locales` como origem dos dados, com a licença deles.

### Domínio

- AD-7: `dossier.ts` não importa nada de `render/`, `game/` ou Phaser. Recebe fatos de
  runtime mais tabelas, devolve struct.
- AD-8: Quando um dado não existe para a espécie, o campo correspondente vem vazio e a linha
  **não é renderizada**. Não existe texto de preenchimento como "desconhecido" para bioma,
  egg move ou hidden ability. A ausência de tier Smogon continua exibindo `?`, como na v2.
- AD-9: Para um Pokémon fundido, o painel mostra os dois nomes, resolve o tier entre as duas
  linhas como a v2 já faz, e exibe os campos factuais da espécie primária — que é o que o
  objeto de runtime entrega.
- AD-10: O índice de biomas devolve todas as ocorrências da espécie, cada uma com bioma,
  tier de raridade e hora do dia. Espécie que não aparece em bioma nenhum devolve lista
  vazia sem erro.

### Painel

- AD-11: Com o painel fechado, nenhum objeto do painel existe na cena — verificável por
  `size === 0`, no padrão de CA-19.
- AD-12: A tecla que abre o painel **não é consumida pelo jogo** em nenhuma das duas telas.
  O requisito é a ausência de conflito, não uma tecla específica; qual tecla satisfaz isso é
  determinado por verificação em jogo na tarefa A6.
- AD-13: Em batalha dupla, acionar a tecla de novo alterna o painel para o outro inimigo, e
  uma terceira vez o fecha.
- AD-14: Na grade de starter, o painel descreve a espécie sob o cursor do jogo e acompanha
  a navegação.
- AD-15: O painel aberto não cobre a HUD de batalha nem o texto de diálogo do jogo, em
  batalha simples e dupla (estende CA-15 e CA-16).
- AD-16: O painel é legível em viewport de celular, sem código de layout específico para
  mobile — herda escala do container do jogo, como as badges já fazem.
- AD-17: Trocar de tela com o painel aberto limpa o painel exatamente uma vez, no padrão de
  CA-18.

### Manutenção

- AD-18: Um workflow agendado semanalmente roda o gerador contra a HEAD do PokéRogue e, se
  as tabelas mudarem, abre um PR com o diff e com o novo pin em `data/pokerogue-source.json`.
- AD-19: O PR aberto pelo workflow passa por typecheck, lint, test e build antes de ser
  mergeável — reusa o CI de CA-6.
- AD-20: `npm test`, `npm run typecheck` e `npm run lint` passam.

## Edge cases

| Caso | Comportamento esperado |
|---|---|
| Espécie sem hidden ability | linha de HA ausente |
| Espécie sem egg move | linha de egg moves ausente |
| Espécie fora de qualquer pool de bioma (ex.: exclusiva de evento) | linha de biomas ausente |
| Pokémon fundido | dois nomes, tier resolvido entre as linhas, fatos da primária (AD-9) |
| Forma regional | chave espécie+forma resolve normal; sem entrada, cai para a espécie base, como `tier-table.ts` já faz |
| Tecla pressionada durante diálogo do jogo | painel não abre e a tecla é repassada ao jogo |
| Espécie nova, ainda ausente da tabela gerada | campos gerados ausentes; campos de runtime continuam aparecendo |
| Batalha dupla com um inimigo já derrotado | painel só alterna entre alvos vivos |

## Fora de escopo

- Veredito de captura, nature recomendada, IVs recomendados, builds, sinergias.
- Calculadora de catch e de dano — dependem deste dossiê e vêm no slice C.
- Busca por tecla (Ctrl+K) — slice B, reusa `panel.ts` e `dossier.ts` sem alteração.
- Qualquer backend, conta de usuário ou sincronização.
