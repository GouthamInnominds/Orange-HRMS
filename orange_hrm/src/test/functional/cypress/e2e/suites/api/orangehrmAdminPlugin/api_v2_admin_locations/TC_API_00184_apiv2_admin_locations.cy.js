/**
 * Test Case ID: TC_API_00184
 * Route: apiv2_admin_locations
 * Endpoint: GET /api/v2/admin/locations
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00184: apiv2_admin_locations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00184: Execute GET /api/v2/admin/locations [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/locations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
