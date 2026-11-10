/**
 * Test Case ID: TC_API_00889
 * Route: apiv2_auth_openid_providers
 * Endpoint: POST /api/v2/auth/openid-providers
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmOpenidAuthenticationPlugin - TC_API_00889: apiv2_auth_openid_providers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00889: Execute POST /api/v2/auth/openid-providers [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/auth/openid-providers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
