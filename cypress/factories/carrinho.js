class CarrinhoFactory {
  gerarCarrinho(produtos) {
    return {
      produtos: produtos.map(produto => ({
        idProduto: produto.idProduto,
        quantidade: produto.quantidade || 1,
      })),
    };
  }

  gerarCarrinhoComUmProduto(idProduto, quantidade = 1) {
    return {
      produtos: [
        {
          idProduto,
          quantidade,
        },
      ],
    };
  }

  gerarCarrinhoComMultiplosProdutos(listaProdutos) {
    return {
      produtos: listaProdutos,
    };
  }

  gerarCarrinhoVazio() {
    return {
      produtos: [],
    };
  }
}

module.exports = new CarrinhoFactory();
