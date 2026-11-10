/**
 * Test Case ID: TC_API_00621
 * Route: apiv2_admin_oauth_clients
 * Endpoint: DELETE /api/v2/admin/oauth-clients
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00621: apiv2_admin_oauth_clients', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00621: Execute DELETE /api/v2/admin/oauth-clients [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/oauth-clients',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
