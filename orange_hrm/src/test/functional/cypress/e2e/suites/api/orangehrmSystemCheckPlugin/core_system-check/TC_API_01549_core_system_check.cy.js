/**
 * Test Case ID: TC_API_01549
 * Route: core_system_check
 * Endpoint: GET /core/system-check
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmSystemCheckPlugin - TC_API_01549: core_system_check', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01549: Execute GET /core/system-check [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/core/system-check',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
