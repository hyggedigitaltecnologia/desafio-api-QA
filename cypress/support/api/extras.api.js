
class Extras {
  validarErro(response, statusCode, mensagemEsperada) {
    expect(response.status).to.eq(statusCode);
    expect(response.body).to.have.property('message');
    if (mensagemEsperada) {
      expect(response.body.message).to.eq(mensagemEsperada);
    }
  }

  validarSucesso(response, statusCode, mensagemEsperada) {
    expect(response.status).to.eq(statusCode);
    expect(response.body).to.have.property('message');
    if (mensagemEsperada) {
      expect(response.body.message).to.eq(mensagemEsperada);
    }
  }

  validarListagem(response) {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('quantidade');
    expect(response.body).to.have.property('usuarios').or.to.have.property('produtos').or.to.have.property('carrinhos');
  }

  gerarTimestamp() {
    return new Date().getTime();
  }

  aguardar(ms) {
    return cy.wait(ms);
  }

  validarChaves(objeto, chavesEsperadas) {
    chavesEsperadas.forEach((chave) => {
      expect(objeto).to.have.property(chave);
    });
  }

  validarProdutoCarrinho(produto) {
    expect(produto).to.have.property('idProduto');
    expect(produto).to.have.property('quantidade');
    expect(produto.quantidade).to.be.greaterThan(0);
  }

  validarEstruturaCarrinho(carrinho) {
    expect(carrinho).to.have.property('produtos');
    expect(carrinho.produtos).to.be.an('array');
    expect(carrinho).to.have.property('precoTotal');
    expect(carrinho).to.have.property('quantidadeTotal');
    expect(carrinho).to.have.property('idUsuario');
  }
}

module.exports = new Extras();
