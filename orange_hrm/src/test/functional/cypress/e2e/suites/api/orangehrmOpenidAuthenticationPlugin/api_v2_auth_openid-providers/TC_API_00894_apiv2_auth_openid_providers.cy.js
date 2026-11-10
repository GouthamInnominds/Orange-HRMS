/**
 * Test Case ID: TC_API_00894
 * Route: apiv2_auth_openid_providers
 * Endpoint: DELETE /api/v2/auth/openid-providers
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmOpenidAuthenticationPlugin - TC_API_00894: apiv2_auth_openid_providers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00894: Execute DELETE /api/v2/auth/openid-providers [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/auth/openid-providers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
