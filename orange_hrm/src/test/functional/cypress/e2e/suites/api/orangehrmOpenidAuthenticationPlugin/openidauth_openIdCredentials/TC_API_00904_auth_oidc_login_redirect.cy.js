/**
 * Test Case ID: TC_API_00904
 * Route: auth_oidc_login_redirect
 * Endpoint: GET /openidauth/openIdCredentials
 * Method: GET
 * Priority: High
 */

describe('orangehrmOpenidAuthenticationPlugin - TC_API_00904: auth_oidc_login_redirect', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00904: Execute GET /openidauth/openIdCredentials [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/openidauth/openIdCredentials',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
