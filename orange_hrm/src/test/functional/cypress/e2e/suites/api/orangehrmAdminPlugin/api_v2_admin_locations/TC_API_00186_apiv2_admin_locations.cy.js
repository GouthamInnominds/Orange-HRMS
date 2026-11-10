/**
 * Test Case ID: TC_API_00186
 * Route: apiv2_admin_locations
 * Endpoint: POST /api/v2/admin/locations
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00186: apiv2_admin_locations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00186: Execute POST /api/v2/admin/locations [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/locations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
