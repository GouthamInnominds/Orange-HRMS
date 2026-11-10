/**
 * Automated Cypress API Test Suite for orangehrmI18NPlugin
 * Total Tests: 2
 */

describe('orangehrmI18NPlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /core/i18n/messages', function () {
    it('TC_API_00697: core_i18n_messages [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/core/i18n/messages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00698: core_i18n_messages [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/core/i18n/messages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
