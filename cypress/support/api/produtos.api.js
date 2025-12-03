const httpClient = require('./http.client');
const { ENDPOINTS } = require('../../config/env');

class ProdutosAPI {
  listar(queryParams = '') {
    return httpClient.get(`${ENDPOINTS.PRODUTOS}${queryParams}`);
  }

  buscarPorId(id) {
    return httpClient.get(`${ENDPOINTS.PRODUTOS}/${id}`);
  }

  criar(produtoData) {
    const payload = {
      nome: produtoData.nome,
      preco: produtoData.preco,
      descricao: produtoData.descricao,
      quantidade: produtoData.quantidade,
    };

    return httpClient.post(ENDPOINTS.PRODUTOS, payload);
  }

  atualizar(id, produtoData) {
    const payload = {
      nome: produtoData.nome,
      preco: produtoData.preco,
      descricao: produtoData.descricao,
      quantidade: produtoData.quantidade,
    };

    return httpClient.put(`${ENDPOINTS.PRODUTOS}/${id}`, payload);
  }

  deletar(id) {
    return httpClient.delete(`${ENDPOINTS.PRODUTOS}/${id}`);
  }

  criarComSucesso(produtoData) {
    return this.criar(produtoData).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('_id');
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      return response;
    });
  }

  buscarPorNome(nome) {
    return this.listar(`?nome=${nome}`);
  }
}

module.exports = new ProdutosAPI();
