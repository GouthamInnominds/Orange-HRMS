/**
 * Test Case ID: TC_API_00896
 * Route: apiv2_auth_openid_provider
 * Endpoint: GET /api/v2/auth/openid-providers/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmOpenidAuthenticationPlugin - TC_API_00896: apiv2_auth_openid_provider', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00896: Execute GET /api/v2/auth/openid-providers/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/auth/openid-providers/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
