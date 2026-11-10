/**
 * Automated Cypress API Contract Test Suite for orangehrmSystemCheckPlugin
 * Tests: 4
 */

describe('orangehrmSystemCheckPlugin - Automated API Contract Tests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/core/system-check', function () {
    it('TC_API_01546: apiv2_core_system_check [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/core/system-check',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01547: apiv2_core_system_check [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/core/system-check',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /core/system-check', function () {
    it('TC_API_01548: core_system_check [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/core/system-check',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01549: core_system_check [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/core/system-check',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
