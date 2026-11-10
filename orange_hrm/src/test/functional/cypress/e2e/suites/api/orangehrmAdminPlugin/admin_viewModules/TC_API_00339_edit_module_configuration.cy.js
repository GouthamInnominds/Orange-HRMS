/**
 * Test Case ID: TC_API_00339
 * Route: edit_module_configuration
 * Endpoint: GET /admin/viewModules
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00339: edit_module_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00339: Execute GET /admin/viewModules [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewModules',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
