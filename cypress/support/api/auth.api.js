const httpClient = require('./http.client');
const { ENDPOINTS } = require('../../config/env');

class AuthAPI {
  login(email, password) {
    const payload = {
      email,
      password,
    };

    return httpClient.post(ENDPOINTS.LOGIN, payload);
  }

  loginComSucesso(email, password) {
    return this.login(email, password).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('authorization');
      expect(response.body.message).to.eq('Login realizado com sucesso');

      if (response.body.authorization) {
        Cypress.env('token', response.body.authorization);
      }

      return response;
    });
  }

  loginComFalha(email, password, expectedMessage) {
    return this.login(email, password).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq(expectedMessage || 'Email e/ou senha inválidos');
      return response;
    });
  }
}

module.exports = new AuthAPI();
