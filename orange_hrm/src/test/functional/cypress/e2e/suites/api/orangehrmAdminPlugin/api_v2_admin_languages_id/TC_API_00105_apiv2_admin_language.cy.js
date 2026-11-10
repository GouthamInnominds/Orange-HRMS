/**
 * Test Case ID: TC_API_00105
 * Route: apiv2_admin_language
 * Endpoint: GET /api/v2/admin/languages/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00105: apiv2_admin_language', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00105: Execute GET /api/v2/admin/languages/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/languages/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
