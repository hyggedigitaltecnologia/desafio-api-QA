module.exports = {
  // Mensagens de sucesso
  MENSAGENS_SUCESSO: {
    LOGIN: 'Login realizado com sucesso',
    CADASTRO: 'Cadastro realizado com sucesso',
    EXCLUSAO: 'Registro excluído com sucesso',
    ALTERACAO: 'Registro alterado com sucesso',
  },

  // Mensagens de erro
  MENSAGENS_ERRO: {
    LOGIN_INVALIDO: 'Email e/ou senha inválidos',
    EMAIL_DUPLICADO: 'Este email já está sendo usado',
    USUARIO_NAO_ENCONTRADO: 'Usuário não encontrado',
    PRODUTO_NAO_ENCONTRADO: 'Produto não encontrado',
    // ServeRest retorna atualmente 'Carrinho não encontrado' ao buscar por ID inexistente
    CARRINHO_NAO_ENCONTRADO: 'Carrinho não encontrado',
    PRODUTO_DUPLICADO: 'Já existe produto com esse nome',
    SEM_TOKEN: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
    USUARIO_COM_CARRINHO: 'Não é permitido excluir usuário com carrinho cadastrado',
    PRODUTO_EM_CARRINHO: 'Não é permitido excluir produto que faz parte de carrinho',
    QUANTIDADE_INSUFICIENTE: 'Produto não possui quantidade suficiente',
  },

  // Status codes HTTP
  STATUS_CODE: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
  },
};
