/// <reference types="cypress" />

const authAPI = require('../../support/api/auth.api');
const usuariosAPI = require('../../support/api/usuarios.api');
const usuarioFactory = require('../../factories/usuario');
const { MENSAGENS_SUCESSO, MENSAGENS_ERRO, STATUS_CODE } = require('../../data/mensagens');

describe('Testes de Login - Autenticação', () => {
  let usuarioTeste;

  beforeEach(() => {
    usuarioTeste = usuarioFactory.gerarUsuario('true');
  });

  afterEach(() => {
    if (usuarioTeste && usuarioTeste._id) {
      usuariosAPI.deletar(usuarioTeste._id);
    }
  });

  context('Cenários Críticos de Sucesso', () => {
    it('CT001 - Deve realizar login com sucesso usando credenciais válidas', () => {
      usuariosAPI.criarComSucesso(usuarioTeste).then((response) => {
        usuarioTeste._id = response.body._id;

        authAPI.loginComSucesso(usuarioTeste.email, usuarioTeste.password).then((loginResponse) => {
          expect(loginResponse.status).to.eq(STATUS_CODE.OK);
          expect(loginResponse.body).to.have.property('message', MENSAGENS_SUCESSO.LOGIN);
          expect(loginResponse.body).to.have.property('authorization');
          expect(loginResponse.body.authorization).to.not.be.empty;
          expect(loginResponse.body.authorization).to.include('Bearer');

          expect(Cypress.env('token')).to.not.be.undefined;
        });
      });
    });

    it('CT002 - Deve retornar token de autorização válido após login bem-sucedido', () => {
      usuariosAPI.criarComSucesso(usuarioTeste).then((response) => {
        usuarioTeste._id = response.body._id;

        authAPI.loginComSucesso(usuarioTeste.email, usuarioTeste.password).then((loginResponse) => {
          const token = loginResponse.body.authorization;

          expect(token).to.be.a('string');
          expect(token).to.include('Bearer ');
          expect(token.split(' ')[1]).to.have.length.greaterThan(10);

          cy.request({
            method: 'GET',
            url: '/usuarios',
            headers: {
              Authorization: token,
            },
          }).then((response) => {
            expect(response.status).to.eq(STATUS_CODE.OK);
          });
        });
      });
    });
  });

  context('Cenários Críticos de Falha', () => {
    it('CT003 - Não deve realizar login com email inválido', () => {
      const emailInvalido = 'usuario_inexistente@teste.com';
      const senhaQualquer = 'senha123';

      authAPI.login(emailInvalido, senhaQualquer).then((response) => {
        expect(response.status).to.eq(STATUS_CODE.UNAUTHORIZED);
        expect(response.body).to.have.property('message', MENSAGENS_ERRO.LOGIN_INVALIDO);
        expect(response.body).to.not.have.property('authorization');
      });
    });

    it('CT004 - Não deve realizar login com senha incorreta', () => {
      usuariosAPI.criarComSucesso(usuarioTeste).then((response) => {
        usuarioTeste._id = response.body._id;

        const senhaIncorreta = 'senha_errada_123';
        authAPI.login(usuarioTeste.email, senhaIncorreta).then((loginResponse) => {
          expect(loginResponse.status).to.eq(STATUS_CODE.UNAUTHORIZED);
          expect(loginResponse.body).to.have.property('message', MENSAGENS_ERRO.LOGIN_INVALIDO);
          expect(loginResponse.body).to.not.have.property('authorization');
        });
      });
    });
  });

  context('Cenários Adicionais de Validação', () => {
    it('CT005 - Não deve realizar login sem informar email', () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: {
          password: 'senha123',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(STATUS_CODE.BAD_REQUEST);
        expect(response.body).to.have.property('email');
      });
    });

    it('CT006 - Não deve realizar login sem informar senha', () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: {
          email: 'teste@teste.com',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(STATUS_CODE.BAD_REQUEST);
        expect(response.body).to.have.property('password');
      });
    });
  });
});
