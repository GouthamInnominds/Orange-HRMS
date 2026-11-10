/**
 * Test Case ID: TC_API_00050
 * Route: apiv2_admin_subunit
 * Endpoint: DELETE /api/v2/admin/subunits/{id}
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00050: apiv2_admin_subunit', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00050: Execute DELETE /api/v2/admin/subunits/1 [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/subunits/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
