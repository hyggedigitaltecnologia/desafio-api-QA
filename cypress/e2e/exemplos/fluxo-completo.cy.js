const authAPI = require('../../support/api/auth.api');
const usuariosAPI = require('../../support/api/usuarios.api');
const produtosAPI = require('../../support/api/produtos.api');
const carrinhosAPI = require('../../support/api/carrinhos.api');
const usuarioFactory = require('../../factories/usuario');
const produtoFactory = require('../../factories/produto');
const carrinhoFactory = require('../../factories/carrinho');
const { STATUS_CODE } = require('../../data/mensagens');

describe('Exemplo: Fluxo Completo E2E - Compra de Produto', () => {
  let usuario;
  let produto;
  let token;

  it('Deve realizar fluxo completo de compra', () => {
    usuario = usuarioFactory.gerarUsuarioAdmin();

    cy.log('📝 Passo 1: Criando usuário administrador');
    usuariosAPI.criarComSucesso(usuario).then((response) => {
      usuario._id = response.body._id;
      expect(response.status).to.eq(STATUS_CODE.CREATED);
      cy.log(`✅ Usuário criado com ID: ${usuario._id}`);

      cy.log('🔐 Passo 2: Realizando login');
      return authAPI.loginComSucesso(usuario.email, usuario.password);
    }).then((loginResponse) => {
      token = loginResponse.body.authorization;
      expect(token).to.not.be.empty;
      cy.log('✅ Login realizado com sucesso');

      cy.log('📦 Passo 3: Criando produto');
      produto = produtoFactory.gerarProduto();
      return produtosAPI.criarComSucesso(produto);
    }).then((produtoResponse) => {
      produto._id = produtoResponse.body._id;
      expect(produtoResponse.status).to.eq(STATUS_CODE.CREATED);
      cy.log(`✅ Produto criado com ID: ${produto._id}`);

      cy.log('🛒 Passo 4: Adicionando produto ao carrinho');
      const carrinho = carrinhoFactory.gerarCarrinhoComUmProduto(produto._id, 2);
      return carrinhosAPI.cadastrarComSucesso(carrinho);
    }).then((carrinhoResponse) => {
      expect(carrinhoResponse.status).to.eq(STATUS_CODE.CREATED);
      cy.log(`✅ Carrinho criado com ID: ${carrinhoResponse.body._id}`);

      cy.log('💳 Passo 5: Concluindo compra');
      return carrinhosAPI.concluirCompraComSucesso();
    }).then((conclusaoResponse) => {
      expect(conclusaoResponse.status).to.eq(STATUS_CODE.OK);
      cy.log('✅ Compra concluída com sucesso!');

      cy.log('🧹 Limpando dados de teste');
      produtosAPI.deletar(produto._id);
      usuariosAPI.deletar(usuario._id);
      cy.log('✅ Fluxo E2E completado com sucesso! 🎉');
    });
  });
});
