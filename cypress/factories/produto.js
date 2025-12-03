const { faker } = require('@faker-js/faker');

class ProdutoFactory {
  gerarProduto() {
    const timestamp = new Date().getTime();

    return {
      nome: `Produto Teste ${timestamp}`,
      preco: faker.number.int({ min: 10, max: 1000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 100 }),
    };
  }

  gerarProdutoComNome(nome) {
    const produto = this.gerarProduto();
    produto.nome = nome;
    return produto;
  }

  gerarProdutoSemEstoque() {
    const produto = this.gerarProduto();
    produto.quantidade = 0;
    return produto;
  }

  gerarProdutoInvalido() {
    return {
      nome: '',
      preco: -10,
      descricao: '',
      quantidade: -5,
    };
  }
}

module.exports = new ProdutoFactory();
