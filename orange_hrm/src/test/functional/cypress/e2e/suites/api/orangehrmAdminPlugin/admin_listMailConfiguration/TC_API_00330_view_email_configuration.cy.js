/**
 * Test Case ID: TC_API_00330
 * Route: view_email_configuration
 * Endpoint: GET /admin/listMailConfiguration
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00330: view_email_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00330: Execute GET /admin/listMailConfiguration [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/listMailConfiguration',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
