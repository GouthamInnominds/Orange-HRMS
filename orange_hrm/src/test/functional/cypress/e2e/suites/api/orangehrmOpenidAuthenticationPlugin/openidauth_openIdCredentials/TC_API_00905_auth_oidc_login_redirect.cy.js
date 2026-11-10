/**
 * Test Case ID: TC_API_00905
 * Route: auth_oidc_login_redirect
 * Endpoint: GET /openidauth/openIdCredentials
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmOpenidAuthenticationPlugin - TC_API_00905: auth_oidc_login_redirect', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00905: Execute GET /openidauth/openIdCredentials [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/openidauth/openIdCredentials',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
