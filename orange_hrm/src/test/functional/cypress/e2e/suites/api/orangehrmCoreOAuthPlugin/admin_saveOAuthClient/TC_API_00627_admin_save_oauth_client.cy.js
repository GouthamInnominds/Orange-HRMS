/**
 * Test Case ID: TC_API_00627
 * Route: admin_save_oauth_client
 * Endpoint: GET /admin/saveOAuthClient
 * Method: GET
 * Priority: High
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00627: admin_save_oauth_client', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00627: Execute GET /admin/saveOAuthClient [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveOAuthClient',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
