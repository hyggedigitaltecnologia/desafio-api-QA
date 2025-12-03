const BASE_URL = Cypress.env('apiUrl') || 'https://serverest.dev';

module.exports = {
  BASE_URL,
  ENDPOINTS: {
    LOGIN: '/login',
    USUARIOS: '/usuarios',
    PRODUTOS: '/produtos',
    CARRINHOS: '/carrinhos',
  },

  HEADERS: {
    CONTENT_TYPE: 'application/json',
  },

  TIMEOUTS: {
    DEFAULT: 10000,
    LONG: 30000,
  },
};
