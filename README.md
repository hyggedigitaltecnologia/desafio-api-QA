# 🚀 Desafio API QA - Automação de Testes com Cypress

[![Cypress](https://img.shields.io/badge/Cypress-13.6.2-brightgreen.svg)](https://www.cypress.io/)
[![Node](https://img.shields.io/badge/Node-v18+-blue.svg)](https://nodejs.org/)
[![ServeRest](https://img.shields.io/badge/API-ServeRest-orange.svg)](https://serverest.dev/)

Projeto de automação de testes de API REST utilizando Cypress para validação dos endpoints da API pública [ServeRest](https://serverest.dev/).

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Execução dos Testes](#execução-dos-testes)
- [Cenários de Teste](#cenários-de-teste)
- [Relatórios](#relatórios)
- [Boas Práticas Implementadas](#boas-práticas-implementadas)

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico para avaliar habilidades em automação de testes de API. O objetivo é validar os principais endpoints da API ServeRest, cobrindo funcionalidades de:

- ✅ **Login/Autenticação**
- ✅ **Usuários**
- ✅ **Produtos**
- ✅ **Carrinhos**

## 🛠️ Tecnologias Utilizadas

- **[Cypress](https://www.cypress.io/)** - Framework de testes E2E
- **[Node.js](https://nodejs.org/)** - Ambiente de execução JavaScript
- **[@faker-js/faker](https://fakerjs.dev/)** - Geração de dados dinâmicos
- **[Mochawesome](https://www.npmjs.com/package/cypress-mochawesome-reporter)** - Geração de relatórios HTML
- **JavaScript** - Linguagem de programação

## 📁 Estrutura do Projeto

```
desafio-api-QA/
│
├── cypress/
│   ├── config/                    # Configurações do projeto
│   │   └── env.js                 # Variáveis de ambiente
│   │
│   ├── data/                      # Dados estáticos de teste
│   │   ├── mensagens.js           # Mensagens de validação
│   │   ├── usuarios.js            # Dados fixos de usuários
│   │   └── termos-uso.js          # Dados de termos de uso
│   │
│   ├── e2e/                       # Testes E2E organizados por funcionalidade
│   │   ├── auth/
│   │   │   └── login.cy.js        # Testes de autenticação/login
│   │   ├── usuario/
│   │   │   └── usuarios.cy.js     # Testes de CRUD de usuários
│   │   ├── produtos/
│   │   │   └── produtos.cy.js     # Testes de CRUD de produtos
│   │   └── carrinhos/
│   │       └── carrinhos.cy.js    # Testes de fluxo de carrinhos
│   │
│   ├── factories/                 # Factories para geração de dados dinâmicos
│   │   ├── usuario.js             # Factory de usuários
│   │   ├── produto.js             # Factory de produtos
│   │   └── carrinho.js            # Factory de carrinhos
│   │
│   ├── fixtures/                  # Arquivos JSON com dados fixos
│   │   ├── usuarios.json
│   │   └── produtos.json
│   │
│   └── support/
│       ├── api/                   # Módulos de API (Page Object Model)
│       │   ├── auth.api.js        # Métodos de autenticação
│       │   ├── usuarios.api.js    # Métodos de usuários
│       │   ├── produtos.api.js    # Métodos de produtos
│       │   ├── carrinhos.api.js   # Métodos de carrinhos
│       │   ├── http.client.js     # Cliente HTTP reutilizável
│       │   └── extras.api.js      # Funções auxiliares
│       │
│       ├── commands.js            # Comandos customizados do Cypress
│       └── e2e.js                 # Configurações globais
│
├── .gitignore                     # Arquivos ignorados pelo Git
├── cypress.config.js              # Configuração principal do Cypress
├── cypress.env.json               # Variáveis de ambiente
├── package.json                   # Dependências do projeto
└── README.md                      # Documentação do projeto
```

## 🔧 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn** - Gerenciador de pacotes
- **Git** - [Download](https://git-scm.com/)

## 📥 Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/desafio-api-QA.git
cd desafio-api-QA
```

2. **Instale as dependências:**

```bash
npm install
```

ou

```bash
yarn install
```

## ▶️ Execução dos Testes

### Executar todos os testes (modo headless):

```bash
npm test
```

### Abrir o Cypress Test Runner (modo interativo):

```bash
npm run cy:open
```

### Executar testes de uma funcionalidade específica:

```bash
# Testes de Login
npm run test:login

# Testes de Usuários
npm run test:usuarios

# Testes de Produtos
npm run test:produtos

# Testes de Carrinhos
npm run test:carrinhos
```

### Executar em diferentes navegadores:

```bash
# Chrome
npm run test:chrome

# Firefox
npm run test:firefox

# Edge
npm run test:edge
```

### Executar testes com interface (headed mode):

```bash
npm run test:headed
```

## 📝 Cenários de Teste

### 🔐 Login/Autenticação

#### Cenários Críticos Automatizados:
1. **CT001** - Login com credenciais válidas
2. **CT002** - Validação de token de autorização após login

#### Todos os Cenários Identificados:
- ✅ Login com credenciais válidas (email e senha corretos)
- ✅ Validação de token JWT retornado
- ✅ Login com email inválido/inexistente
- ✅ Login com senha incorreta
- ✅ Login sem informar email
- ✅ Login sem informar senha
- ⚠️ Login com campos vazios
- ⚠️ Login com formato de email inválido
- ⚠️ Validação de expiração do token
- ⚠️ Tentativa de reutilização de token expirado

### 👥 Usuários

#### Cenários Críticos Automatizados:
1. **CT007** - Cadastro de novo usuário com sucesso
2. **CT008** - Listagem de todos os usuários

#### Todos os Cenários Identificados:
- ✅ Cadastrar usuário com dados válidos
- ✅ Cadastrar usuário administrador
- ✅ Cadastrar usuário comum (não administrador)
- ✅ Listar todos os usuários
- ✅ Buscar usuário por ID válido
- ✅ Buscar usuário por email
- ✅ Editar/atualizar usuário existente
- ✅ Excluir usuário sem vínculos
- ✅ Tentar cadastrar usuário com email duplicado
- ✅ Buscar usuário com ID inexistente
- ✅ Validar campos obrigatórios no cadastro
- ⚠️ Cadastrar usuário com email em formato inválido
- ⚠️ Excluir usuário com carrinho ativo
- ⚠️ Editar usuário com email já utilizado por outro
- ⚠️ Cadastrar usuário com senha fraca
- ⚠️ Validar tamanho mínimo/máximo dos campos
- ⚠️ Tentar excluir usuário sem autenticação
- ⚠️ Buscar usuários com filtros (query params)

### 📦 Produtos

#### Cenários Críticos Automatizados:
1. **CT015** - Cadastro de produto por usuário administrador
2. **CT016** - Listagem de todos os produtos

#### Todos os Cenários Identificados:
- ✅ Cadastrar produto com usuário administrador autenticado
- ✅ Listar todos os produtos
- ✅ Buscar produto por ID válido
- ✅ Buscar produto por nome
- ✅ Editar/atualizar produto existente
- ✅ Excluir produto sem vínculos
- ✅ Tentar cadastrar produto com nome duplicado
- ✅ Tentar cadastrar produto sem autenticação (token)
- ✅ Validar campos obrigatórios no cadastro
- ✅ Buscar produto com ID inexistente
- ⚠️ Tentar cadastrar produto com usuário não administrador
- ⚠️ Cadastrar produto com preço negativo
- ⚠️ Cadastrar produto com quantidade negativa
- ⚠️ Excluir produto que está em carrinho ativo
- ⚠️ Editar produto alterando quantidade (validar estoque)
- ⚠️ Buscar produtos com filtros (preço, quantidade, etc.)
- ⚠️ Validar limite de caracteres nos campos
- ⚠️ Cadastrar produto com quantidade zero

### 🛒 Carrinhos

#### Cenários Críticos Automatizados:
1. **CT024** - Cadastro de carrinho com produto válido
2. **CT025** - Conclusão de compra (excluir carrinho)

#### Todos os Cenários Identificados:
- ✅ Cadastrar carrinho com um produto
- ✅ Cadastrar carrinho com múltiplos produtos
- ✅ Listar todos os carrinhos
- ✅ Buscar carrinho por ID
- ✅ Concluir compra (excluir carrinho)
- ✅ Cancelar compra e retornar produtos ao estoque
- ✅ Tentar cadastrar carrinho sem autenticação
- ✅ Tentar cadastrar carrinho com produto inexistente
- ✅ Validar que usuário não pode ter mais de um carrinho
- ✅ Tentar cadastrar carrinho vazio (sem produtos)
- ⚠️ Adicionar produto com quantidade maior que estoque disponível
- ⚠️ Validar cálculo correto do preço total
- ⚠️ Validar cálculo correto da quantidade total
- ⚠️ Tentar adicionar produto duplicado no mesmo carrinho
- ⚠️ Validar atualização de estoque ao criar carrinho
- ⚠️ Validar restauração de estoque ao cancelar compra
- ⚠️ Excluir usuário que possui carrinho ativo
- ⚠️ Excluir produto que está em carrinho ativo

**Legenda:**
- ✅ Cenário automatizado
- ⚠️ Cenário identificado (possível implementação futura)

## 📊 Relatórios

Os relatórios são gerados automaticamente após a execução dos testes usando o Mochawesome.

Localização dos relatórios:
```
cypress/reports/
```

Para visualizar o relatório HTML, abra o arquivo:
```
cypress/reports/index.html
```

## 🎓 Boas Práticas Implementadas

### 1. **Arquitetura Modular (Page Object Model para APIs)**
- Separação de responsabilidades em módulos de API
- Reutilização de código através de classes e métodos
- Facilita manutenção e escalabilidade

### 2. **Factory Pattern**
- Geração dinâmica de dados de teste usando Faker
- Evita conflitos com dados duplicados
- Testes independentes e isolados

### 3. **Gestão de Dados**
- Separação entre dados estáticos (fixtures) e dinâmicos (factories)
- Constantes centralizadas para mensagens e status codes
- Facilita atualização e manutenção

### 4. **HTTP Client Reutilizável**
- Cliente HTTP centralizado com tratamento de headers e autenticação
- Métodos genéricos (GET, POST, PUT, DELETE)
- Injeção automática de token de autenticação

### 5. **Comandos Customizados**
- Comandos Cypress personalizados para operações comuns
- Abstração de complexidade
- Código mais limpo e legível

### 6. **Organização de Testes**
- Testes organizados por funcionalidade
- Uso de `context` para agrupar cenários relacionados
- Nomenclatura clara e descritiva (CT001, CT002, etc.)

### 7. **Hooks de Ciclo de Vida**
- `before`, `beforeEach`, `after`, `afterEach` para setup e cleanup
- Isolamento de testes
- Dados limpos entre execuções

### 8. **Validações Robustas**
- Validação de status code
- Validação de estrutura de resposta (schema)
- Validação de mensagens de erro/sucesso
- Validações de negócio

### 9. **Tratamento de Erros**
- `failOnStatusCode: false` para testar cenários de erro
- Validações específicas para cada tipo de falha

### 10. **Configuração Centralizada**
- Variáveis de ambiente no `cypress.config.js`
- Configurações reutilizáveis
- Fácil alteração de ambientes (dev, staging, prod)

### 11. **Relatórios Automatizados**
- Integração com Mochawesome
- Relatórios HTML com gráficos e estatísticas
- Screenshots em caso de falhas

### 12. **Versionamento e Documentação**
- `.gitignore` configurado adequadamente
- README completo e detalhado
- Comentários no código quando necessário

## 📈 Métricas de Cobertura

### Resumo de Testes Implementados:
- **Login:** 6 casos de teste
- **Usuários:** 8 casos de teste
- **Produtos:** 9 casos de teste
- **Carrinhos:** 9 casos de teste

**Total:** 32 casos de teste automatizados

### Cobertura por Funcionalidade:
- ✅ **Login:** 100% dos cenários críticos
- ✅ **Usuários:** 100% dos cenários críticos + cenários adicionais
- ✅ **Produtos:** 100% dos cenários críticos + cenários adicionais
- ✅ **Carrinhos:** 100% dos cenários críticos + cenários adicionais

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de avaliação técnica.

## 👨‍💻 Autor

Desenvolvido como parte do desafio técnico de QA - Automação de Testes de API.

---

## 📚 Referências

- [Documentação Oficial do Cypress](https://docs.cypress.io/)
- [API ServeRest](https://serverest.dev/)
- [Faker.js Documentation](https://fakerjs.dev/guide/)
- [Mochawesome Reporter](https://www.npmjs.com/package/cypress-mochawesome-reporter)

---

**🎯 Status do Projeto:** ✅ Completo e funcional

**📅 Última atualização:** Dezembro 2025
