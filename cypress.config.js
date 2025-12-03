const { defineConfig } = require('cypress');

module.exports = defineConfig({
  env: {
    apiUrl: 'https://serverest.dev',
    hideXhr: true,
  },

  e2e: {
    baseUrl: 'https://serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,

    retries: {
      runMode: 2,
      openMode: 0,
    },

    viewportWidth: 1280,
    viewportHeight: 720,

    testIsolation: true,

    chromeWebSecurity: false,
    video: false,

    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });

      return config;
    },
  },

  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    reportPageTitle: 'Relatório de Testes - ServeRest API',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: false,
    html: true,
    json: true,
  },
});
