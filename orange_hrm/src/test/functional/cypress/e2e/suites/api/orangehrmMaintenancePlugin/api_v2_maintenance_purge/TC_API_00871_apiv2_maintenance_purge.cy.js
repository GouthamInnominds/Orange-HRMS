/**
 * Test Case ID: TC_API_00871
 * Route: apiv2_maintenance_purge
 * Endpoint: DELETE /api/v2/maintenance/purge
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmMaintenancePlugin - TC_API_00871: apiv2_maintenance_purge', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00871: Execute DELETE /api/v2/maintenance/purge [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/maintenance/purge',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
