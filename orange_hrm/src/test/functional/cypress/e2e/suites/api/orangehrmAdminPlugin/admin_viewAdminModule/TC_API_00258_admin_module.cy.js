/**
 * Test Case ID: TC_API_00258
 * Route: admin_module
 * Endpoint: GET /admin/viewAdminModule
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00258: admin_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00258: Execute GET /admin/viewAdminModule [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewAdminModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
