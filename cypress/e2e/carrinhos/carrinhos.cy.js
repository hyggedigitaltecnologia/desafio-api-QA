/// <reference types="cypress" />

const carrinhosAPI = require('../../support/api/carrinhos.api');
const produtosAPI = require('../../support/api/produtos.api');
const usuariosAPI = require('../../support/api/usuarios.api');
const authAPI = require('../../support/api/auth.api');
const carrinhoFactory = require('../../factories/carrinho');
const produtoFactory = require('../../factories/produto');
const usuarioFactory = require('../../factories/usuario');
const { MENSAGENS_SUCESSO, MENSAGENS_ERRO, STATUS_CODE } = require('../../data/mensagens');

describe('Testes de Carrinhos - Fluxo Completo', () => {
  let usuarioAdmin;
  let produtoTeste;
  let carrinhoTeste;
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

    produtosAPI.criarComSucesso(produtoTeste).then((response) => {
      produtoTeste._id = response.body._id;
    });
  });

  after(() => {
    if (usuarioAdmin && usuarioAdmin._id) {
      usuariosAPI.deletar(usuarioAdmin._id);
    }
  });

  afterEach(() => {
    if (carrinhoTeste && carrinhoTeste._id) {
      carrinhosAPI.concluirCompra().then(() => {
      });
      carrinhoTeste._id = null;
    }

    if (produtoTeste && produtoTeste._id) {
      produtosAPI.deletar(produtoTeste._id);
    }
  });

  context('Cenários Críticos de Sucesso', () => {
    it('CT024 - Deve cadastrar um carrinho com um produto com sucesso', () => {
      const dadosCarrinho = carrinhoFactory.gerarCarrinhoComUmProduto(produtoTeste._id, 2);

      carrinhosAPI.cadastrar(dadosCarrinho).then((response) => {
        carrinhoTeste = response.body;

        expect(response.status).to.eq(STATUS_CODE.CREATED);
        expect(response.body).to.have.property('message', MENSAGENS_SUCESSO.CADASTRO);
        expect(response.body).to.have.property('_id');
        expect(response.body._id).to.not.be.empty;

        carrinhosAPI.buscarPorId(response.body._id).then((getResponse) => {
          expect(getResponse.status).to.eq(STATUS_CODE.OK);
          expect(getResponse.body).to.have.property('produtos');
          expect(getResponse.body.produtos).to.be.an('array');
          expect(getResponse.body.produtos).to.have.length(1);
          expect(getResponse.body.produtos[0].idProduto).to.eq(produtoTeste._id);
          expect(getResponse.body.produtos[0].quantidade).to.eq(2);
          expect(getResponse.body).to.have.property('precoTotal');
          expect(getResponse.body).to.have.property('quantidadeTotal');
        });
      });
    });

    it('CT025 - Deve concluir compra e excluir carrinho com sucesso', () => {
      const dadosCarrinho = carrinhoFactory.gerarCarrinhoComUmProduto(produtoTeste._id, 1);

      carrinhosAPI.cadastrarComSucesso(dadosCarrinho).then((response) => {
        const carrinhoId = response.body._id;

        carrinhosAPI.concluirCompra().then((conclusaoResponse) => {
          expect(conclusaoResponse.status).to.eq(STATUS_CODE.OK);
          expect(conclusaoResponse.body).to.have.property('message', MENSAGENS_SUCESSO.EXCLUSAO);

          carrinhosAPI.buscarPorId(carrinhoId).then((getResponse) => {
            expect(getResponse.status).to.eq(STATUS_CODE.BAD_REQUEST);
            expect(getResponse.body.message).to.eq(MENSAGENS_ERRO.CARRINHO_NAO_ENCONTRADO);
          });

          carrinhoTeste._id = null;
        });
      });
    });
  });

  context('Cenários Críticos de Falha', () => {
    it('CT026 - Não deve cadastrar carrinho sem autenticação (token)', () => {
      const tokenBackup = Cypress.env('token');
      Cypress.env('token', null);

      const dadosCarrinho = carrinhoFactory.gerarCarrinhoComUmProduto(produtoTeste._id, 1);

      carrinhosAPI.cadastrar(dadosCarrinho).then((response) => {
        expect(response.status).to.eq(STATUS_CODE.UNAUTHORIZED);
        expect(response.body).to.have.property('message', MENSAGENS_ERRO.SEM_TOKEN);
        expect(response.body).to.not.have.property('_id');

        Cypress.env('token', tokenBackup);
      });
    });

    it('CT027 - Não deve cadastrar carrinho com produto inexistente', () => {
      const dadosCarrinho = carrinhoFactory.gerarCarrinhoComUmProduto('PRODUTO_INEXISTENTE_123', 1);

      carrinhosAPI.cadastrar(dadosCarrinho).then((response) => {
        expect(response.status).to.eq(STATUS_CODE.BAD_REQUEST);
        expect(response.body).to.have.property('message');
        expect(response.body).to.not.have.property('_id');
      });
    });
  });

  context('Cenários Adicionais de Validação', () => {
    it('CT028 - Deve listar todos os carrinhos cadastrados', () => {
      const dadosCarrinho = carrinhoFactory.gerarCarrinhoComUmProduto(produtoTeste._id, 1);

      carrinhosAPI.cadastrarComSucesso(dadosCarrinho).then((response) => {
        carrinhoTeste = response.body;

        carrinhosAPI.listar().then((listResponse) => {
          expect(listResponse.status).to.eq(STATUS_CODE.OK);
          expect(listResponse.body).to.have.property('quantidade');
          expect(listResponse.body).to.have.property('carrinhos');
          expect(listResponse.body.carrinhos).to.be.an('array');
          expect(listResponse.body.quantidade).to.be.greaterThan(0);

          const primeiroCarrinho = listResponse.body.carrinhos[0];
          expect(primeiroCarrinho).to.have.property('produtos');
          expect(primeiroCarrinho).to.have.property('precoTotal');
          expect(primeiroCarrinho).to.have.property('quantidadeTotal');
          expect(primeiroCarrinho).to.have.property('idUsuario');
          expect(primeiroCarrinho).to.have.property('_id');
        });
      });
    });

    it('CT029 - Deve cancelar compra e retornar produtos ao estoque', () => {
      produtosAPI.buscarPorId(produtoTeste._id).then((produtoResponse) => {
        const quantidadeInicial = produtoResponse.body.quantidade;

        const dadosCarrinho = carrinhoFactory.gerarCarrinhoComUmProduto(produtoTeste._id, 2);

        carrinhosAPI.cadastrarComSucesso(dadosCarrinho).then((carrinhoResponse) => {
          carrinhoTeste = carrinhoResponse.body;

          carrinhosAPI.cancelarCompra().then((cancelResponse) => {
            expect(cancelResponse.status).to.eq(STATUS_CODE.OK);
            expect(cancelResponse.body).to.have.property('message');
            expect(cancelResponse.body.message).to.include(MENSAGENS_SUCESSO.EXCLUSAO);

            produtosAPI.buscarPorId(produtoTeste._id).then((produtoFinal) => {
              expect(produtoFinal.body.quantidade).to.eq(quantidadeInicial);
            });

            carrinhoTeste._id = null;
          });
        });
      });
    });

    it('CT030 - Deve cadastrar carrinho com múltiplos produtos', () => {
      const produto2 = produtoFactory.gerarProduto();

      produtosAPI.criarComSucesso(produto2).then((response) => {
        produto2._id = response.body._id;

        const dadosCarrinho = carrinhoFactory.gerarCarrinhoComMultiplosProdutos([
          { idProduto: produtoTeste._id, quantidade: 1 },
          { idProduto: produto2._id, quantidade: 2 },
        ]);

        carrinhosAPI.cadastrar(dadosCarrinho).then((carrinhoResponse) => {
          carrinhoTeste = carrinhoResponse.body;

          expect(carrinhoResponse.status).to.eq(STATUS_CODE.CREATED);
          expect(carrinhoResponse.body).to.have.property('_id');

          carrinhosAPI.buscarPorId(carrinhoResponse.body._id).then((getResponse) => {
            expect(getResponse.body.produtos).to.have.length(2);
            expect(getResponse.body.quantidadeTotal).to.eq(3);
            expect(getResponse.body.precoTotal).to.be.greaterThan(0);
          });

          produtosAPI.deletar(produto2._id);
        });
      });
    });

    it('CT031 - Não deve cadastrar carrinho vazio (sem produtos)', () => {
      const dadosCarrinho = carrinhoFactory.gerarCarrinhoVazio();

      carrinhosAPI.cadastrar(dadosCarrinho).then((response) => {
        expect(response.status).to.eq(STATUS_CODE.BAD_REQUEST);
        expect(response.body).to.have.property('produtos');
      });
    });

    it('CT032 - Usuário não pode ter mais de um carrinho', () => {
      const dadosCarrinho1 = carrinhoFactory.gerarCarrinhoComUmProduto(produtoTeste._id, 1);

      carrinhosAPI.cadastrarComSucesso(dadosCarrinho1).then((response) => {
        carrinhoTeste = response.body;

        const dadosCarrinho2 = carrinhoFactory.gerarCarrinhoComUmProduto(produtoTeste._id, 1);

        carrinhosAPI.cadastrar(dadosCarrinho2).then((response2) => {
          expect(response2.status).to.eq(STATUS_CODE.BAD_REQUEST);
          expect(response2.body.message).to.include('carrinho');
        });
      });
    });
  });
});
