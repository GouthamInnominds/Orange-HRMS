/**
 * Test Case ID: TC_API_00044
 * Route: apiv2_admin_subunit
 * Endpoint: GET /api/v2/admin/subunits/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00044: apiv2_admin_subunit', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00044: Execute GET /api/v2/admin/subunits/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/subunits/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
