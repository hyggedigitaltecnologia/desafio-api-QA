import './commands';

import 'cypress-mochawesome-reporter/register';

Cypress.on('uncaught:exception', () => {
  return false;
});

beforeEach(() => {
  cy.log('Iniciando novo teste...');
});

afterEach(() => {
  cy.log('Teste finalizado');
});
