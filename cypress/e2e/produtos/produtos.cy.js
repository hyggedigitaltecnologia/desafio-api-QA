/// <reference types="cypress" />

const produtosAPI = require('../../support/api/produtos.api');
const usuariosAPI = require('../../support/api/usuarios.api');
const authAPI = require('../../support/api/auth.api');
const produtoFactory = require('../../factories/produto');
const usuarioFactory = require('../../factories/usuario');
const { MENSAGENS_SUCESSO, MENSAGENS_ERRO, STATUS_CODE } = require('../../data/mensagens');

describe('Testes de Produtos - CRUD Completo', () => {
  let produtoTeste;
  let usuarioAdmin;
  let token;

  before(() => {
    usuarioAdmin = usuarioFactory.gerarUsuarioAdmin();

    usuariosAPI.criarComSucesso(usuarioAdmin).then((response) => {
      usuarioAdmin._id = response.body._id;

      return authAPI.loginComSucesso(usuarioAdmin.email, usuarioAdmin.password);
    }).then((loginResponse) => {
      token = loginResponse.body.authorization;
      Cypress.env('token', token);
    });
  });

  beforeEach(() => {
    produtoTeste = produtoFactory.gerarProduto();
  });

  after(() => {
    if (usuarioAdmin && usuarioAdmin._id) {
      usuariosAPI.deletar(usuarioAdmin._id);
    }
  });

  afterEach(() => {
    if (produtoTeste && produtoTeste._id) {
      produtosAPI.deletar(produtoTeste._id);
    }
  });

  context('Cenários Críticos de Sucesso', () => {
    it('CT015 - Deve cadastrar um novo produto com sucesso (usuário administrador)', () => {
      produtosAPI.criar(produtoTeste).then((response) => {
        produtoTeste._id = response.body._id;

        expect(response.status).to.eq(STATUS_CODE.CREATED);
        expect(response.body).to.have.property('message', MENSAGENS_SUCESSO.CADASTRO);
        expect(response.body).to.have.property('_id');
        expect(response.body._id).to.not.be.empty;

        produtosAPI.buscarPorId(response.body._id).then((getResponse) => {
          expect(getResponse.status).to.eq(STATUS_CODE.OK);
          expect(getResponse.body.nome).to.eq(produtoTeste.nome);
          expect(getResponse.body.preco).to.eq(produtoTeste.preco);
          expect(getResponse.body.descricao).to.eq(produtoTeste.descricao);
          expect(getResponse.body.quantidade).to.eq(produtoTeste.quantidade);
        });
      });
    });

    it('CT016 - Deve listar todos os produtos cadastrados', () => {
      produtosAPI.criarComSucesso(produtoTeste).then((response) => {
        produtoTeste._id = response.body._id;

        produtosAPI.listar().then((listResponse) => {
          expect(listResponse.status).to.eq(STATUS_CODE.OK);
          expect(listResponse.body).to.have.property('quantidade');
          expect(listResponse.body).to.have.property('produtos');
          expect(listResponse.body.produtos).to.be.an('array');
          expect(listResponse.body.quantidade).to.be.greaterThan(0);

          const primeiroProduto = listResponse.body.produtos[0];
          expect(primeiroProduto).to.have.property('nome');
          expect(primeiroProduto).to.have.property('preco');
          expect(primeiroProduto).to.have.property('descricao');
          expect(primeiroProduto).to.have.property('quantidade');
          expect(primeiroProduto).to.have.property('_id');
        });
      });
    });
  });

  context('Cenários Críticos de Falha', () => {
    it('CT017 - Não deve cadastrar produto com nome duplicado', () => {
      produtosAPI.criarComSucesso(produtoTeste).then((response) => {
        produtoTeste._id = response.body._id;

        const produtoDuplicado = produtoFactory.gerarProdutoComNome(produtoTeste.nome);

        produtosAPI.criar(produtoDuplicado).then((duplicateResponse) => {
          expect(duplicateResponse.status).to.eq(STATUS_CODE.BAD_REQUEST);
          expect(duplicateResponse.body).to.have.property('message', MENSAGENS_ERRO.PRODUTO_DUPLICADO);
          expect(duplicateResponse.body).to.not.have.property('_id');
        });
      });
    });

    it('CT018 - Não deve cadastrar produto sem autenticação (token)', () => {
      const tokenBackup = Cypress.env('token');
      Cypress.env('token', null);

      produtosAPI.criar(produtoTeste).then((response) => {
        expect(response.status).to.eq(STATUS_CODE.UNAUTHORIZED);
        expect(response.body).to.have.property('message', MENSAGENS_ERRO.SEM_TOKEN);
        expect(response.body).to.not.have.property('_id');

        Cypress.env('token', tokenBackup);
      });
    });
  });

  context('Cenários Adicionais de Validação', () => {
    it('CT019 - Deve editar um produto existente', () => {
      produtosAPI.criarComSucesso(produtoTeste).then((response) => {
        produtoTeste._id = response.body._id;

        const dadosAtualizados = produtoFactory.gerarProduto();
        produtosAPI.atualizar(produtoTeste._id, dadosAtualizados).then((updateResponse) => {
          expect(updateResponse.status).to.eq(STATUS_CODE.OK);
          expect(updateResponse.body).to.have.property('message', MENSAGENS_SUCESSO.ALTERACAO);

          produtosAPI.buscarPorId(produtoTeste._id).then((getResponse) => {
            expect(getResponse.body.nome).to.eq(dadosAtualizados.nome);
            expect(getResponse.body.preco).to.eq(dadosAtualizados.preco);
            expect(getResponse.body.descricao).to.eq(dadosAtualizados.descricao);
            expect(getResponse.body.quantidade).to.eq(dadosAtualizados.quantidade);
          });
        });
      });
    });

    it('CT020 - Deve excluir um produto existente', () => {
      produtosAPI.criarComSucesso(produtoTeste).then((response) => {
        const produtoId = response.body._id;

        produtosAPI.deletar(produtoId).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(STATUS_CODE.OK);
          expect(deleteResponse.body).to.have.property('message', MENSAGENS_SUCESSO.EXCLUSAO);

          produtosAPI.buscarPorId(produtoId).then((getResponse) => {
            expect(getResponse.status).to.eq(STATUS_CODE.BAD_REQUEST);
            expect(getResponse.body.message).to.eq(MENSAGENS_ERRO.PRODUTO_NAO_ENCONTRADO);
          });

          produtoTeste._id = null;
        });
      });
    });

    it('CT021 - Deve buscar produto por nome', () => {
      produtosAPI.criarComSucesso(produtoTeste).then((response) => {
        produtoTeste._id = response.body._id;

        produtosAPI.buscarPorNome(produtoTeste.nome).then((searchResponse) => {
          expect(searchResponse.status).to.eq(STATUS_CODE.OK);
          expect(searchResponse.body.quantidade).to.eq(1);
          expect(searchResponse.body.produtos[0].nome).to.eq(produtoTeste.nome);
        });
      });
    });

    it('CT022 - Deve validar campos obrigatórios ao cadastrar produto', () => {
      cy.request({
        method: 'POST',
        url: '/produtos',
        body: {},
        headers: {
          Authorization: token,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(STATUS_CODE.BAD_REQUEST);
        expect(response.body).to.have.property('nome');
        expect(response.body).to.have.property('preco');
        expect(response.body).to.have.property('descricao');
        expect(response.body).to.have.property('quantidade');
      });
    });

    it('CT023 - Não deve buscar produto com ID inexistente', () => {
      const idInexistente = 'ID_PRODUTO_INEXISTENTE';

      produtosAPI.buscarPorId(idInexistente).then((response) => {
        expect(response.status).to.eq(STATUS_CODE.BAD_REQUEST);
        expect(response.body).to.have.property('id');
        expect(response.body.id).to.include('id deve ter exatamente 16 caracteres');
      });
    });
  });
});
