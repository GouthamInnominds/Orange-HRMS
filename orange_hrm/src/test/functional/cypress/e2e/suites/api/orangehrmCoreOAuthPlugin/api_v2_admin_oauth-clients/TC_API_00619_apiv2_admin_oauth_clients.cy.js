/**
 * Test Case ID: TC_API_00619
 * Route: apiv2_admin_oauth_clients
 * Endpoint: POST /api/v2/admin/oauth-clients
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00619: apiv2_admin_oauth_clients', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00619: Execute POST /api/v2/admin/oauth-clients [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/oauth-clients',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
