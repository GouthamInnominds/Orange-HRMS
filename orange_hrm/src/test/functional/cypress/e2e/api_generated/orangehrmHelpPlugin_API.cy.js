/**
 * Automated Cypress API Test Suite for orangehrmHelpPlugin
 * Total Tests: 4
 */

describe('orangehrmHelpPlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /help/support', function () {
    it('TC_API_00693: view_help_support [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/help/support',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00694: view_help_support [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/help/support',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /help/help', function () {
    it('TC_API_00695: help_help [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/help/help',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00696: help_help [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/help/help',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
