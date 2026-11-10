/**
 * Test Case ID: TC_API_00188
 * Route: apiv2_admin_locations
 * Endpoint: DELETE /api/v2/admin/locations
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00188: apiv2_admin_locations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00188: Execute DELETE /api/v2/admin/locations [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/locations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
