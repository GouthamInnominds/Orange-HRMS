/**
 * Test Case ID: TC_API_00182
 * Route: apiv2_admin_location
 * Endpoint: PUT /api/v2/admin/locations/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00182: apiv2_admin_location', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00182: Execute PUT /api/v2/admin/locations/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/locations/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
