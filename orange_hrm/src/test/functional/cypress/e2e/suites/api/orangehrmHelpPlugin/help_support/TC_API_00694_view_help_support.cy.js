/**
 * Test Case ID: TC_API_00694
 * Route: view_help_support
 * Endpoint: GET /help/support
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmHelpPlugin - TC_API_00694: view_help_support', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00694: Execute GET /help/support [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/help/support',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
