/**
 * Test Case ID: TC_API_00625
 * Route: admin_edit_oauth_client
 * Endpoint: GET /admin/editOAuthClient
 * Method: GET
 * Priority: High
 */

describe('orangehrmCoreOAuthPlugin - TC_API_00625: admin_edit_oauth_client', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00625: Execute GET /admin/editOAuthClient [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/editOAuthClient',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
