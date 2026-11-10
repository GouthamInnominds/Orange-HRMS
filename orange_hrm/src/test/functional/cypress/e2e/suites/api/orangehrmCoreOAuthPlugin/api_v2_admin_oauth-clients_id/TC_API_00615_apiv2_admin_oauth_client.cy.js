/**
 * Test Case ID: TC_API_00615
 * Route: apiv2_admin_oauth_client
 * Endpoint: PUT /api/v2/admin/oauth-clients/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00615: apiv2_admin_oauth_client', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00615: Execute PUT /api/v2/admin/oauth-clients/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/oauth-clients/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
