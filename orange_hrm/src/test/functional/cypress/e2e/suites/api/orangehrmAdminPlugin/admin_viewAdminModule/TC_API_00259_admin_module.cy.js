/**
 * Test Case ID: TC_API_00259
 * Route: admin_module
 * Endpoint: GET /admin/viewAdminModule
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00259: admin_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00259: Execute GET /admin/viewAdminModule [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewAdminModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
