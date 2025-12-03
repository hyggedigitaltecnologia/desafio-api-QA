import authAPI from './api/auth.api';
import usuariosAPI from './api/usuarios.api';
import produtosAPI from './api/produtos.api';
import carrinhosAPI from './api/carrinhos.api';

Cypress.Commands.add('login', (email, senha) => {
  return authAPI.login(email, senha).then((response) => {
    if (response.body.authorization) {
      Cypress.env('token', response.body.authorization);
    }
    return response;
  });
});

Cypress.Commands.add('createUserAndLogin', (userData) => {
  return usuariosAPI.criar(userData).then((userResponse) => {
    return authAPI.login(userData.email, userData.password).then((loginResponse) => {
      return {
        user: userResponse.body,
        login: loginResponse.body,
      };
    });
  });
});

Cypress.Commands.add('validateSchema', (response, expectedKeys) => {
  expectedKeys.forEach((key) => {
    expect(response.body).to.have.property(key);
  });
});

Cypress.Commands.add('validateStatusCode', (response, expectedStatus) => {
  expect(response.status).to.eq(expectedStatus);
});

Cypress.Commands.add('validateMessage', (response, expectedMessage) => {
  expect(response.body.message).to.eq(expectedMessage);
});

Cypress.Commands.add('cleanupTestData', (userId, produtoId, carrinhoId) => {
  if (carrinhoId) {
    carrinhosAPI.deletar(carrinhoId);
  }
  if (produtoId) {
    produtosAPI.deletar(produtoId);
  }
  if (userId) {
    usuariosAPI.deletar(userId);
  }
});
