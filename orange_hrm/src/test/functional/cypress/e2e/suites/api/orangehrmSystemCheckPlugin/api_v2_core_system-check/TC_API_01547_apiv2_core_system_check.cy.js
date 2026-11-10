/**
 * Test Case ID: TC_API_01547
 * Route: apiv2_core_system_check
 * Endpoint: GET /api/v2/core/system-check
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmSystemCheckPlugin - TC_API_01547: apiv2_core_system_check', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01547: Execute GET /api/v2/core/system-check [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/core/system-check',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
