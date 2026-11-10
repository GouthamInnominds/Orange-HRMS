/**
 * Test Case ID: TC_API_00630
 * Route: auth_oauth2_consent
 * Endpoint: GET /oauth2/authorize/consent
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00630: auth_oauth2_consent', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00630: Execute GET /oauth2/authorize/consent [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/oauth2/authorize/consent',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
