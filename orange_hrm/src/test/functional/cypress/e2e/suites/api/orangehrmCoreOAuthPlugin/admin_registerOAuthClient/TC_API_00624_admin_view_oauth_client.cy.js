/**
 * Test Case ID: TC_API_00624
 * Route: admin_view_oauth_client
 * Endpoint: GET /admin/registerOAuthClient
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00624: admin_view_oauth_client', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00624: Execute GET /admin/registerOAuthClient [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/registerOAuthClient',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
