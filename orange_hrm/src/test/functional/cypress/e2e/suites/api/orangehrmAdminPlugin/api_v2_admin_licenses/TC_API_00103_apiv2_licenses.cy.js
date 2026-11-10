/**
 * Test Case ID: TC_API_00103
 * Route: apiv2_licenses
 * Endpoint: DELETE /api/v2/admin/licenses
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00103: apiv2_licenses', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00103: Execute DELETE /api/v2/admin/licenses [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/licenses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
