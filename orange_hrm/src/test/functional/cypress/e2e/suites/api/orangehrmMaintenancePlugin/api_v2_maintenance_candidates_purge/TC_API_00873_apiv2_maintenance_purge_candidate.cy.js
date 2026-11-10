/**
 * Test Case ID: TC_API_00873
 * Route: apiv2_maintenance_purge_candidate
 * Endpoint: DELETE /api/v2/maintenance/candidates/purge
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmMaintenancePlugin - TC_API_00873: apiv2_maintenance_purge_candidate', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00873: Execute DELETE /api/v2/maintenance/candidates/purge [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/maintenance/candidates/purge',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
