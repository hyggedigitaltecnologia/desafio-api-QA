const { faker } = require('@faker-js/faker');

class UsuarioFactory {
  gerarUsuario(administrador = 'false') {
    const timestamp = new Date().getTime();

    return {
      nome: faker.person.fullName(),
      email: `teste_${timestamp}_${faker.string.alphanumeric(5)}@qa.com.br`,
      password: 'teste@123',
      administrador,
    };
  }

  gerarUsuarioAdmin() {
    return this.gerarUsuario('true');
  }

  gerarUsuarioComum() {
    return this.gerarUsuario('false');
  }

  gerarUsuarioInvalido() {
    return {
      nome: '',
      email: 'email_invalido',
      password: '123',
      administrador: 'false',
    };
  }
}

module.exports = new UsuarioFactory();
