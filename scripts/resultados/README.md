# Resultados Page Modules

Este diretório organiza a lógica da página `resultados.html` em módulos para facilitar manutenção e integração com back-end.

## Estrutura

- `data.js`: fonte de dados mock (`PROPERTIES`) e utilitário de moeda.
- `filters.js`: parsing de query params, estado inicial, filtros, ordenação e atualização de URL.
- `render.js`: renderização dos cards/lista e hidratação do formulário de pesquisa.
- `index.js`: orquestra eventos UI (modal de destino, calendário, mobile toggles, filtros e submit).

## Integração com back-end

1. Substituir `PROPERTIES` por resposta da API.
2. Manter shape dos campos usados na renderização (`name`, `location`, `price`, `rating`, etc.) ou adaptar `render.js`.
3. Se a API filtrar no servidor, manter apenas serialização de filtros/query em `filters.js`.

## Convenções

- Evitar lógica de DOM fora de `index.js`/`render.js`.
- Evitar regras de negócio de filtro fora de `filters.js`.
- Preferir funções puras em módulos utilitários para facilitar testes.
