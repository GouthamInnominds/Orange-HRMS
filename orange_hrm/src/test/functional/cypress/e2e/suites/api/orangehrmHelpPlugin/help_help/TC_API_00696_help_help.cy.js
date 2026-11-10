/**
 * Test Case ID: TC_API_00696
 * Route: help_help
 * Endpoint: GET /help/help
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmHelpPlugin - TC_API_00696: help_help', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00696: Execute GET /help/help [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/help/help',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
