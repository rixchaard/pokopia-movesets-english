# Pokémon Pokopia — PT-BR com Movesets em Inglês

Variante da tradução comunitária de [LucianoNeo/pokemon-pokopia-pt-br](https://github.com/LucianoNeo/pokemon-pokopia-pt-br), mantendo os **nomes dos movimentos em inglês** e as descrições e demais textos em português do Brasil.

## Download

**[Baixar o patch pronto — Movesets em Inglês](https://github.com/rixchaard/pokemon-pokopia-pt-br/releases/latest)**

Baixe o arquivo `pokopia-ptbr-ataques-em-ingles.zip` anexado à release. O botão **Code → Download ZIP** baixa o código do projeto e não substitui o pacote pronto da release.

## O que mudou

- 63 entradas ajustadas em 16 tabelas de texto, incluindo a lista de movimentos e referências em botões, tutoriais, objetivos e diálogos.
- Nomes como **Leafage, Water Gun, Rock Smash, Cut, Surf, Headbutt, Strength, Waterfall e Rain Dance** ficam em inglês.
- Descrições permanecem em português. Palavras comuns continuam traduzidas: uma cachoeira do cenário é uma cachoeira; o movimento é **Waterfall**.
- Somente dois arquivos do jogo são modificados: `romfs/LD_C0_R.BIN` e `romfs/LI_C0_R.IDX`.

Base: tradução comunitária **0.0.5**, commit `7543125ee0649383541c127c01ce251b8aad046c`, para **Pokémon Pokopia 1.0.4 / update 327680**. A tradução de origem continua parcial. Esta variante não é uma revisão geral dos demais textos.

## Instalação

1. Feche o jogo e faça backup do par de arquivos atualmente instalado.
2. Extraia a pasta `romfs` do ZIP da release na sobreposição de recursos compatível com seu ambiente e esse update, ou substitua o par correspondente no RomFS extraído.
3. Mantenha os dois arquivos juntos e selecione **English** no jogo.

Para desfazer, feche o jogo e restaure os dois arquivos do backup.

## Verificação

Os arquivos produzidos foram reabertos e descompactados. Foram conferidos os textos alterados, os comandos, as entradas preservadas e os índices. **Esta variante ainda precisa de teste no jogo.**

O ZIP inclui `alteracoes.json`, com as entradas antes/depois e os hashes. As capturas herdadas do projeto original mostram a tradução de origem, e não comprovam esta variante.

## Reproduzir os ajustes

Os arquivos em `romfs` neste histórico são a **base comunitária**, mantida para reprodução. O BIN é armazenado com Git LFS. Para obter diretamente a variante pronta, use a release.

Com Node.js instalado e o par original dessa versão obtido por Git LFS, execute na raiz do projeto:

```sh
node apply-moves-en.cjs romfs build/romfs
```

O script confere os hashes da base, preserva os originais e grava o par modificado em `build/romfs`. As 63 alterações estão em `moves-en.json`. Não são necessárias dependências npm.

## Créditos

A tradução PT-BR de origem é do projeto **LucianoNeo/pokemon-pokopia-pt-br**. Este fork acrescenta os ajustes de nomenclatura em inglês; não reivindica autoria da tradução original. Pokémon e os arquivos do jogo pertencem aos respectivos titulares. Projeto comunitário não oficial.
