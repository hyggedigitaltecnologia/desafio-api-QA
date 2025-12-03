const httpClient = require('./http.client');
const { ENDPOINTS } = require('../../config/env');

class CarrinhosAPI {
  listar(queryParams = '') {
    return httpClient.get(`${ENDPOINTS.CARRINHOS}${queryParams}`);
  }

  buscarPorId(id) {
    return httpClient.get(`${ENDPOINTS.CARRINHOS}/${id}`);
  }

  cadastrar(carrinhoData) {
    const payload = {
      produtos: carrinhoData.produtos,
    };

    return httpClient.post(ENDPOINTS.CARRINHOS, payload);
  }

  concluirCompra() {
    return httpClient.delete(`${ENDPOINTS.CARRINHOS}/concluir-compra`);
  }

  cancelarCompra() {
    return httpClient.delete(`${ENDPOINTS.CARRINHOS}/cancelar-compra`);
  }

  cadastrarComSucesso(carrinhoData) {
    return this.cadastrar(carrinhoData).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('_id');
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      return response;
    });
  }

  concluirCompraComSucesso() {
    return this.concluirCompra().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Registro excluído com sucesso');
      return response;
    });
  }
}

module.exports = new CarrinhosAPI();
