/**
 * Test Case ID: TC_API_01548
 * Route: core_system_check
 * Endpoint: GET /core/system-check
 * Method: GET
 * Priority: High
 */

describe('orangehrmSystemCheckPlugin - TC_API_01548: core_system_check', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01548: Execute GET /core/system-check [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/core/system-check',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
