# Trybe Futebol Clube (TFC) Project

![TFC app Screen Shot][product-screenshot]

<!-- ### Link da documentação do projeto: []() -->


<!-- TABLE OF CONTENTS -->
<details>
  <summary><h2><strong>Sumário</strong></h2></summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre o Projeto</a>
      <ul>
        <li><a href="#contexto">Contexto</a></li>
        <li><a href="#tecnologias-utilizadas">Tecnologias Utilizadas</a></li>
        <li><a href="#funcionalidades-implementadas">Funcionalidades Implementadas</a></li>
      </ul>
    </li>
    <li>
      <a href="#para-iniciar-a-aplicação-localmente">Para Iniciar a Aplicação Localmente</a>
      <ul>
        <li><a href="#pré-requisitos">Pré-requisitos</a></li>
        <li><a href="#clonando-o-repositório">Clonando o Repositório</a></li>
        <li><a href="#rodando-serviços-com-docker-compose-e-executando-a-aplicação">Rodando Serviços com docker-compose e Executando a Aplicação</a></li>
        <!-- <li><a href="#acessando-container-e-instalando-dependências">Acessando Container e Instalando Dependências</a></li> -->
        <!-- <li><a href="#subindo-banco-de-dados-e-executando-a-aplicação">Subindo Banco de Dados e Executando a Aplicação</a></li> -->
        <li><a href="#executando-testes-do-back-end-e-análise-de-cobertura">Executando Testes do Back-end e Análise de Cobertura</a></li>
        <li><a href="#parando-a-aplicação-e-descendo-os-containers">Parando a Aplicação e Descendo os Containers</a></li>
      </ul>
    </li>
    <li><a href="#contribuições-e-autoria">Contribuições e Autoria</a></li>
  </ol>
</details>


# Sobre o Projeto
  O projeto Trybe Futebol Clube (TFC) é uma aplicação fullstack de um site informativo sobre partidas e classificações de futebol. Nesse projeto foi desenvilvido o back-end, composto por uma API REST que acessa banco de dados relacional, com rotas para leitura, cadastro e edição de informações sobre partidas de futebol e classificações de times. A API construída é consimida por um front-end desenvolvido e provido pela [Trybe](https://www.betrybe.com/).

## Contexto
  Esse projeto foi desenvolvido por _[Juliana Álvares](https://www.linkedin.com/in/juliana-alvares/)_, como parte do processo de aprendizado do Módulo de Back-end, do curso de Desenvolvimento Web da [Trybe](https://www.betrybe.com/) :rocket:
  
  _"A Trybe é uma escola do futuro para qualquer pessoa que queira mudar de vida e construir uma carreira de sucesso em tecnologia, onde a pessoa tem a possibilidade de só pagar quando conseguir um bom trabalho."_

  O programa conta com mais de 1.500 horas de aulas presenciais e online, aborda introdução ao desenvolvimento de software, front-end, back-end, ciência da computação, engenharia de software, metodologias Ágeis e habilidades comportamentais.

## Tecnologias Utilizadas

  #### Linguagens:
  * [![TypeScript][TypeScript-img]][TypeScript-url]
  * [![JavaScript - ES6][JavaScript-img]][JavaScript-url]

  #### Back-end:
  * [![MySQL][MySQL-img]][MySQL-url]
  * [![Node.js][Node-img]][Node-url]
  * [![Express][Express-img]][Express-url]
  * [![Sequelize][Sequelize-img]][Sequelize-url]
  * [![JWT][JWT-img]][JWT-url]

  #### Testes (back-end):
  * [![Mocha][Mocha-img]][Mocha-url]
  * [![Chai][Chai-img]][Chai-url]

  #### Auxiliares (Execução):
  * [![Docker][Docker-img]][Docker-url]
  <!-- * [![Postman][Postman-img]][Postman-url] -->
  <!-- * [![Railway][Railway-img]][Railway-url] -->

## Funcionalidades Implementadas

  - Construção de banco de dados MySQL, utilizando a ORM (Object Relational Mapper) Sequelize, com base no seguinte diagrama de Entidade-Relacionamento fornecido pela [Trybe](https://www.betrybe.com/):

    ![Diagrama ER do Banco][der-screenshot]

    Fonte: TRYBE, 2022

  - API REST com os seguintes endpoints, conectados ao banco de dados, desenvolvida em modelo de camadas MSC (Model, Service e Controller):

    ![TFC API Routes][routes-screenshot]

    Tais rotas possibilitam as seguintes funcionalidades no front-end:

      ![TrybeTunes Gif][product-gif]

      - Visualização da tabela e classificação geral dos times, com pontuações;
      - Visualização da tabela e classificação dos times mandantes, com pontuações;
      - Visualização da tabela e classificação dos times visitantes, com pontuações;
      - Visualização de dados de todas as partidas;
      - Visualização de dados das partidas em andamento;
      - Visualização de dados das partidas finalizadas;
      - Login com identificação da pessoa usuária e habilitação de permissões correspondentes;
      - Editar gols de partida em andamento (para usuário administrador);
      - Finalizar partida em andamento (para usuário administrador);
      - Cadastrar nova partida (para usuário administrador).

<!-- 
    **Obs.: A explicação detalhada de cada rota pode ser acessada na [Documentação da API]().** -->

# Para Iniciar a Aplicação Localmente
  Para rodar esta aplicação localmente é necessário garantir o cumprimento dos pré-requisitos, fazer uma cópia do repositório e executar as instruções a seguir. Neste projeto é sugerido o uso do Docker, a partir do docker-compose já configurado no repositório, que subirá os serviços `frontend`, `backend` e `db`, via containers chamados `app_frontend`, `app_backend` e `db`.

  Obs.: No docker-compose estão configuradas as seguintes portas por serviço: `db` na porta `3002`, `backend` na porta `3001` (url base: `http://localhost:3001`), `frontend` na porta `3000` (url base: `http://localhost:3000/`).

## Pré-requisitos
  * [docker-compose](https://docs.docker.com/compose/) em versão 1.29.2 ou superior.
  * [node](https://nodejs.org/en) em versão 16.14.0 ou superior.
  <!-- * Estar com a porta padrão do `mysql` (`3306`) liberada, pois o serviço `db` está configurado no docker-compose para conexão nesta porta. -->

## Clonando o Repositório
  ```bash
    git clone git@github.com:AlvaresJu/trybe_futebol_clube.git
  ```
## Rodando Serviços com docker-compose e Executando a Aplicação
  ```bash
    cd trybe_futebol_clube/
    npm run compose:up
  ```
  Após confirmação dos 3 containers rodando, acessar página: `http://localhost:3000/`

  Obs.: Dados (email e senha) para login como administrador para testes via front-end contidos no arquivo `app/backend/src/database/seeders/20211205212238-users.js`
<!-- ## Acessando Container e Instalando Dependências
  ```bash
    docker exec -it blogs_api bash
    npm install
  ```  -->
<!-- ## Subindo Banco de Dados e Executando a Aplicação
 *Obs.: comandos a serem executados de DENTRO do Container `node`*
  ```bash
    npm start
  ``` -->
## Executando Testes do Back-end e Análise de Cobertura
  ```bash
    docker exec -it app_backend sh
    npm test
    npm run test:coverage
  ```
## Parando a Aplicação e Descendo os Containers
  ```bash
    npm run compose:down
  ```

# Contribuições e Autoria
  Como descrito, este projeto foi proposto pela [Trybe](https://www.betrybe.com/) e desenvolvido por _[Juliana Álvares](https://www.linkedin.com/in/juliana-alvares/)_ durante o curso de Desenvolvimento Web realizado. Por isso, foram disponibilizados pela Trybe alguns arquivos base de configurações e auxiliares ao desenvolvimento do projeto, além de toda a parte do front-end. Segue especificação de autoria dos principais documentos:
  
  Arquivos/diretórios desenvolvidos pela autora do projeto (Juliana Álvares):
  > README.md | images/** | app/frontend/Dockerfile | app/backend/Dockerfile | app/backend/packages.npm | app/backend/src/controllers/** | app/backend/src/database/migrations/** | app/backend/src/database/models/** | app/backend/src/database/seeders/** | app/backend/src/entities/** | app/backend/src/interfaces/** | app/backend/src/middlewares/** | app/backend/src/routes/** | app/backend/src/services/** | app/backend/src/tests/** | app/backend/src/utils/** | app/backend/src/app.ts
  
  Arquivos/diretórios desenvolvidos pela Trybe:
  > .editorconfig | apps_install.sh | db.exemple.sql | dockerfile_dennylist.sh | package.json | package-lock.json | app/docker-compose.yml | app/docker-compose.dev.yml | app/frontend/** | app/backend/.eslintrc.json | app/backend/.env.example | app/backend/package.json | app/backend/package-lock.json | app/backend/.sequelizerc | app/backend/nyc.config.js | app/backend/tsc_eval.sh | app/backend/tsconfig.json | app/backend/src/database/config/** | app/backend/src/database/migrations/99999999999999-create-z.js | app/backend/src/database/models/index.ts | app/backend/src/server.ts

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: images/screenshot.png
[routes-screenshot]: images/routes.png
[der-screenshot]: images/diagrama-er.png
[product-gif]: images/features.gif
[MySQL-img]: https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/
[Node-img]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/en
[Express-img]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Sequelize-img]: https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white
[Sequelize-url]: https://sequelize.org/
[JWT-img]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white
[JWT-url]: https://jwt.io/
[TypeScript-img]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[JavaScript-img]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[Docker-img]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[Mocha-img]: https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=Mocha&logoColor=white
[Mocha-url]: https://mochajs.org/
[Chai-img]: https://img.shields.io/badge/chai-A30701?style=for-the-badge&logo=chai&logoColor=white
[Chai-url]: https://www.chaijs.com/
<!-- [Postman-img]: https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white
[Postman-url]: https://www.postman.com/
[Railway-img]: https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white
[Railway-url]: https://railway.app/ -->