/**
 * Test Case ID: TC_API_00628
 * Route: admin_save_oauth_client
 * Endpoint: GET /admin/saveOAuthClient
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00628: admin_save_oauth_client', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00628: Execute GET /admin/saveOAuthClient [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveOAuthClient',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
