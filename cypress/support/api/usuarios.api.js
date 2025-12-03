const httpClient = require('./http.client');
const { ENDPOINTS } = require('../../config/env');

class UsuariosAPI {
  listar(queryParams = '') {
    return httpClient.get(`${ENDPOINTS.USUARIOS}${queryParams}`);
  }

  buscarPorId(id) {
    return httpClient.get(`${ENDPOINTS.USUARIOS}/${id}`);
  }

  criar(userData) {
    const payload = {
      nome: userData.nome,
      email: userData.email,
      password: userData.password,
      administrador: userData.administrador || 'false',
    };

    return httpClient.post(ENDPOINTS.USUARIOS, payload);
  }

  atualizar(id, userData) {
    const payload = {
      nome: userData.nome,
      email: userData.email,
      password: userData.password,
      administrador: userData.administrador || 'false',
    };

    return httpClient.put(`${ENDPOINTS.USUARIOS}/${id}`, payload);
  }

  deletar(id) {
    return httpClient.delete(`${ENDPOINTS.USUARIOS}/${id}`);
  }

  criarComSucesso(userData) {
    return this.criar(userData).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('_id');
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      return response;
    });
  }

  buscarPorEmail(email) {
    return this.listar(`?email=${email}`);
  }
}

module.exports = new UsuariosAPI();
