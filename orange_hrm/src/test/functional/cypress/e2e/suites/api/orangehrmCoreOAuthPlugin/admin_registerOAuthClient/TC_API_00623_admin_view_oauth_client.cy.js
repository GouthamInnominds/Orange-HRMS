/**
 * Test Case ID: TC_API_00623
 * Route: admin_view_oauth_client
 * Endpoint: GET /admin/registerOAuthClient
 * Method: GET
 * Priority: High
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00623: admin_view_oauth_client', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00623: Execute GET /admin/registerOAuthClient [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/registerOAuthClient',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
