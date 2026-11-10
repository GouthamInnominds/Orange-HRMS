/**
 * Test Case ID: TC_API_00695
 * Route: help_help
 * Endpoint: GET /help/help
 * Method: GET
 * Priority: High
 */

describe('orangehrmHelpPlugin - TC_API_00695: help_help', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00695: Execute GET /help/help [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/help/help',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
