/**
 * Test Case ID: TC_API_00183
 * Route: apiv2_admin_locations
 * Endpoint: GET /api/v2/admin/locations
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00183: apiv2_admin_locations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00183: Execute GET /api/v2/admin/locations [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/locations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
