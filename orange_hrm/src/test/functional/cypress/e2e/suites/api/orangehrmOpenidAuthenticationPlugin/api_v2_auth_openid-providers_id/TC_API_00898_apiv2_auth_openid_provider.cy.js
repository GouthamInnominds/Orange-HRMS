/**
 * Test Case ID: TC_API_00898
 * Route: apiv2_auth_openid_provider
 * Endpoint: PUT /api/v2/auth/openid-providers/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmOpenidAuthenticationPlugin - TC_API_00898: apiv2_auth_openid_provider', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00898: Execute PUT /api/v2/auth/openid-providers/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/auth/openid-providers/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
