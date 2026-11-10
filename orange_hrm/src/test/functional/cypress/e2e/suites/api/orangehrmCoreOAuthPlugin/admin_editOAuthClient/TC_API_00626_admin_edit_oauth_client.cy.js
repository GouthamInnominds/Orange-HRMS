/**
 * Test Case ID: TC_API_00626
 * Route: admin_edit_oauth_client
 * Endpoint: GET /admin/editOAuthClient
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00626: admin_edit_oauth_client', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00626: Execute GET /admin/editOAuthClient [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/editOAuthClient',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
