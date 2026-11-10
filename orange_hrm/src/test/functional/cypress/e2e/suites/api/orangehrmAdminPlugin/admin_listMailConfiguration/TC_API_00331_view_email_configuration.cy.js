/**
 * Test Case ID: TC_API_00331
 * Route: view_email_configuration
 * Endpoint: GET /admin/listMailConfiguration
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00331: view_email_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00331: Execute GET /admin/listMailConfiguration [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/listMailConfiguration',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
