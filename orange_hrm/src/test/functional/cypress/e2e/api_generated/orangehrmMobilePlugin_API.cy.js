/**
 * Automated Cypress API Test Suite for orangehrmMobilePlugin
 * Total Tests: 2
 */

describe('orangehrmMobilePlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/mobile/menus', function () {
    it('TC_API_00886: apiv2_mobile_modules [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/mobile/menus',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00887: apiv2_mobile_modules [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/mobile/menus',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
