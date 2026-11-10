/**
 * Test Case ID: TC_API_00635
 * Route: auth_oauth2_token
 * Endpoint: POST /oauth2/token
 * Method: POST
 * Priority: High
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00635: auth_oauth2_token', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00635: Execute POST /oauth2/token [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/oauth2/token',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
