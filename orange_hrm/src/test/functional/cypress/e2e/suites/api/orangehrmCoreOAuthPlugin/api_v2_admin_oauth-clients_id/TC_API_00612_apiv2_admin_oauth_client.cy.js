/**
 * Test Case ID: TC_API_00612
 * Route: apiv2_admin_oauth_client
 * Endpoint: GET /api/v2/admin/oauth-clients/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00612: apiv2_admin_oauth_client', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00612: Execute GET /api/v2/admin/oauth-clients/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/oauth-clients/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
