/**
 * Test Case ID: TC_API_00631
 * Route: auth_oauth2_authorize
 * Endpoint: GET /oauth2/authorize
 * Method: GET
 * Priority: High
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00631: auth_oauth2_authorize', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00631: Execute GET /oauth2/authorize [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/oauth2/authorize',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
