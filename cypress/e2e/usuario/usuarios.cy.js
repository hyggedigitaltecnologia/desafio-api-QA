/// <reference types="cypress" />

const usuariosAPI = require('../../support/api/usuarios.api');
const authAPI = require('../../support/api/auth.api');
const usuarioFactory = require('../../factories/usuario');
const { MENSAGENS_SUCESSO, MENSAGENS_ERRO, STATUS_CODE } = require('../../data/mensagens');

describe('Testes de Usuários - CRUD Completo', () => {
  let usuarioTeste;
  let usuarioAdmin;

  beforeEach(() => {
    usuarioTeste = usuarioFactory.gerarUsuario('false');
    usuarioAdmin = usuarioFactory.gerarUsuarioAdmin();
  });

  afterEach(() => {
    if (usuarioTeste && usuarioTeste._id) {
      usuariosAPI.deletar(usuarioTeste._id);
    }
    if (usuarioAdmin && usuarioAdmin._id) {
      usuariosAPI.deletar(usuarioAdmin._id);
    }
  });

  context('Cenários Críticos de Sucesso', () => {
    it('CT007 - Deve cadastrar um novo usuário com sucesso', () => {
      usuariosAPI.criar(usuarioTeste).then((response) => {
        usuarioTeste._id = response.body._id;

        expect(response.status).to.eq(STATUS_CODE.CREATED);
        expect(response.body).to.have.property('message', MENSAGENS_SUCESSO.CADASTRO);
        expect(response.body).to.have.property('_id');
        expect(response.body._id).to.not.be.empty;

        usuariosAPI.buscarPorId(response.body._id).then((getResponse) => {
          expect(getResponse.status).to.eq(STATUS_CODE.OK);
          expect(getResponse.body.nome).to.eq(usuarioTeste.nome);
          expect(getResponse.body.email).to.eq(usuarioTeste.email);
          expect(getResponse.body.administrador).to.eq(usuarioTeste.administrador);
        });
      });
    });

    it('CT008 - Deve listar todos os usuários cadastrados', () => {
      usuariosAPI.criarComSucesso(usuarioTeste).then((response) => {
        usuarioTeste._id = response.body._id;

        usuariosAPI.listar().then((listResponse) => {
          expect(listResponse.status).to.eq(STATUS_CODE.OK);
          expect(listResponse.body).to.have.property('quantidade');
          expect(listResponse.body).to.have.property('usuarios');
          expect(listResponse.body.usuarios).to.be.an('array');
          expect(listResponse.body.quantidade).to.be.greaterThan(0);

          const primeiroUsuario = listResponse.body.usuarios[0];
          expect(primeiroUsuario).to.have.property('nome');
          expect(primeiroUsuario).to.have.property('email');
          expect(primeiroUsuario).to.have.property('password');
          expect(primeiroUsuario).to.have.property('administrador');
          expect(primeiroUsuario).to.have.property('_id');
        });
      });
    });
  });

  context('Cenários Críticos de Falha', () => {
    it('CT009 - Não deve cadastrar usuário com email duplicado', () => {
      usuariosAPI.criarComSucesso(usuarioTeste).then((response) => {
        usuarioTeste._id = response.body._id;

        const usuarioDuplicado = {
          ...usuarioTeste,
          nome: 'Outro Nome',
        };

        usuariosAPI.criar(usuarioDuplicado).then((duplicateResponse) => {
          // Assert
          expect(duplicateResponse.status).to.eq(STATUS_CODE.BAD_REQUEST);
          expect(duplicateResponse.body).to.have.property('message', MENSAGENS_ERRO.EMAIL_DUPLICADO);
          expect(duplicateResponse.body).to.not.have.property('_id');
        });
      });
    });

    it('CT010 - Não deve buscar usuário com ID inexistente', () => {
      const idInexistente = 'ID_NAO_EXISTE_123456';

      usuariosAPI.buscarPorId(idInexistente).then((response) => {
        expect(response.status).to.eq(STATUS_CODE.BAD_REQUEST);
        expect(response.body).to.have.property('id');
        expect(response.body.id).to.include('id deve ter exatamente 16 caracteres');
      });
    });
  });

  context('Cenários Adicionais de Validação', () => {
    it('CT011 - Deve editar um usuário existente', () => {
      usuariosAPI.criarComSucesso(usuarioTeste).then((response) => {
        usuarioTeste._id = response.body._id;

        const dadosAtualizados = usuarioFactory.gerarUsuario('true');
        usuariosAPI.atualizar(usuarioTeste._id, dadosAtualizados).then((updateResponse) => {
          expect(updateResponse.status).to.eq(STATUS_CODE.OK);
          expect(updateResponse.body).to.have.property('message', MENSAGENS_SUCESSO.ALTERACAO);

          usuariosAPI.buscarPorId(usuarioTeste._id).then((getResponse) => {
            expect(getResponse.body.nome).to.eq(dadosAtualizados.nome);
            expect(getResponse.body.email).to.eq(dadosAtualizados.email);
            expect(getResponse.body.administrador).to.eq(dadosAtualizados.administrador);
          });
        });
      });
    });

    it('CT012 - Deve excluir um usuário existente', () => {
      usuariosAPI.criarComSucesso(usuarioTeste).then((response) => {
        const userId = response.body._id;

        usuariosAPI.deletar(userId).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(STATUS_CODE.OK);
          expect(deleteResponse.body).to.have.property('message', MENSAGENS_SUCESSO.EXCLUSAO);

          usuariosAPI.buscarPorId(userId).then((getResponse) => {
            expect(getResponse.status).to.eq(STATUS_CODE.BAD_REQUEST);
            expect(getResponse.body.message).to.eq(MENSAGENS_ERRO.USUARIO_NAO_ENCONTRADO);
          });

          usuarioTeste._id = null;
        });
      });
    });

    it('CT013 - Deve buscar usuário por email', () => {
      usuariosAPI.criarComSucesso(usuarioTeste).then((response) => {
        usuarioTeste._id = response.body._id;

        usuariosAPI.buscarPorEmail(usuarioTeste.email).then((searchResponse) => {
          expect(searchResponse.status).to.eq(STATUS_CODE.OK);
          expect(searchResponse.body.quantidade).to.eq(1);
          expect(searchResponse.body.usuarios[0].email).to.eq(usuarioTeste.email);
          expect(searchResponse.body.usuarios[0].nome).to.eq(usuarioTeste.nome);
        });
      });
    });

    it('CT014 - Deve validar campos obrigatórios ao cadastrar usuário', () => {
      cy.request({
        method: 'POST',
        url: '/usuarios',
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(STATUS_CODE.BAD_REQUEST);
        expect(response.body).to.have.property('nome');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('password');
        expect(response.body).to.have.property('administrador');
      });
    });
  });
});
