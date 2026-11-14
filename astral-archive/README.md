# Astral Archive — Honkai: Star Rail

Projeto acadêmico para a atividade DW3 — Consumo de API com React e Next.js.

## Sobre o projeto

Astral Archive é um catálogo de personagens de Honkai: Star Rail. A aplicação permite pesquisar personagens e filtrar por elemento, Caminho e raridade. Cada card abre uma página de detalhes com descrição, informações principais, habilidades e Eidolons disponíveis.

## Tecnologias

- Next.js 14 (App Router)
- React 18
- JavaScript
- CSS
- starrail.js

## Requisitos

- Node.js 18 ou superior
- npm

## Como executar

1. Abra o terminal na pasta do projeto.
2. Instale as dependências:

   ```bash
   npm install
   ```

   A instalação do `starrail.js` também prepara os dados em cache utilizados pela biblioteca. A primeira instalação pode demorar um pouco mais.

3. Inicie o servidor:

   ```bash
   npm run dev
   ```

4. Abra `http://localhost:3000` no navegador.

## Rotas da aplicação

| Rota | Descrição |
| --- | --- |
| `/` | Catálogo de personagens |
| `/characters/[id]` | Detalhes de um personagem |
| `/api/characters` | Endpoint interno que retorna a lista |
| `/api/characters/[id]` | Endpoint interno que retorna um personagem pelo ID |

## Como a atividade consome os dados

A biblioteca `starrail.js` é uma biblioteca Node.js que disponibiliza dados do jogo por meio de métodos como `getAllCharacters()`. Ela não é, por si só, uma API REST pública tradicional.

Para adaptar seu uso ao requisito de consumo de API da atividade, o projeto cria dois endpoints REST no próprio Next.js:

- `GET /api/characters`
- `GET /api/characters/:id`

As páginas React consomem esses endpoints usando `fetch()`. Assim, a interface não importa a biblioteca diretamente no navegador: a biblioteca é executada no servidor Next.js.

## Estrutura principal

```text
astral-archive/
├── app/
│   ├── api/
│   │   └── characters/
│   │       ├── route.js
│   │       └── [id]/route.js
│   ├── characters/
│   │   └── [id]/page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── Catalog.js
│   └── CharacterDetails.js
├── lib/
│   └── starrail.js
├── package.json
└── README.md
```

## Referências

- Documentação do starrail.js: https://starrail.vercel.app/api
- Repositório: https://github.com/yuko1101/starrail.js
- Next.js: https://nextjs.org/docs

## Observações

- Os dados e artes pertencem aos respectivos titulares e são utilizados aqui para fins educacionais.
- A disponibilidade de imagens depende das fontes utilizadas pela biblioteca.
- O projeto precisa ser executado e testado no ambiente da faculdade após a instalação das dependências.
