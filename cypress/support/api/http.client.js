const { BASE_URL } = require('../../config/env');

class HttpClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  request(method, endpoint, options = {}) {
    const defaultOptions = {
      method,
      url: `${this.baseUrl}${endpoint}`,
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Adiciona token se existir
    const token = Cypress.env('token');
    if (token) {
      defaultOptions.headers['Authorization'] = token;
    }

    const requestOptions = { ...defaultOptions, ...options };

    return cy.request(requestOptions);
  }

  get(endpoint, options = {}) {
    return this.request('GET', endpoint, options);
  }

  post(endpoint, body, options = {}) {
    return this.request('POST', endpoint, { ...options, body });
  }

  put(endpoint, body, options = {}) {
    return this.request('PUT', endpoint, { ...options, body });
  }

  delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, options);
  }
}

module.exports = new HttpClient();
