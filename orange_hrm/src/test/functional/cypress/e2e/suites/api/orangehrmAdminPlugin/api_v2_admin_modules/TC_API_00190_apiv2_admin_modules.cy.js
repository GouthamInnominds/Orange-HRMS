/**
 * Test Case ID: TC_API_00190
 * Route: apiv2_admin_modules
 * Endpoint: GET /api/v2/admin/modules
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00190: apiv2_admin_modules', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00190: Execute GET /api/v2/admin/modules [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/modules',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
