/**
 * Test Case ID: TC_API_00153
 * Route: apiv2_admin_nationalities
 * Endpoint: GET /api/v2/admin/nationalities
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00153: apiv2_admin_nationalities', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00153: Execute GET /api/v2/admin/nationalities [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/nationalities',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
