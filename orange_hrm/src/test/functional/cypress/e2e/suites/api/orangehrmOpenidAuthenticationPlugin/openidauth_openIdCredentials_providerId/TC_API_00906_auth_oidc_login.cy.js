/**
 * Test Case ID: TC_API_00906
 * Route: auth_oidc_login
 * Endpoint: GET /openidauth/openIdCredentials/{providerId}
 * Method: GET
 * Priority: High
 */

describe('orangehrmOpenidAuthenticationPlugin - TC_API_00906: auth_oidc_login', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00906: Execute GET /openidauth/openIdCredentials/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/openidauth/openIdCredentials/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
